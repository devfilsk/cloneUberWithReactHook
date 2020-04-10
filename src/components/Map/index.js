import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding'

import { getPixelSize } from '~/utils/calcs'

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

import markerImage from '~/assets/marker.png';
import backImage from '~/assets/back.png';
import { Container, LocationBox, LocationText, LocationTimeBox, LocationTimeText, LocationTimeTextSmall, Back, Image } from './styles';

Geocoder.init('AIzaSyCu6wanm5hbipWrZIC1sU6fHOIg-IDdIcM');

export default function Map() {

    const [ region, setRegion ] = useState(null);
    const [ destination, setDestination ] = useState(null);
    const [ duration, setDuration ] = useState(null);
    const [ location, setLocation ] = useState(null);

    const refMapView = useRef(null);

    useEffect(() => {

        if(refMapView.current) {}

        async function handleCurrentPosition() {
            Geolocation.getCurrentPosition(
                async ({ coords: { latitude, longitude }}) => { // success
                    const response = await Geocoder.from({ latitude, longitude });
                    const address = response.results[0].formatted_address;
                    const location = address.substring(0, address.indexOf(',')) // Pega valor antes da primeira virgula
                    // console.log("NOOOO->", response);

                    setLocation(location);

                    setRegion({
                        latitude, 
                        longitude, 
                        latitudeDelta: 0.0143,
                        longitudeDelta: 0.0134
                    })
                },
                (error) => { // error
                    console.log("Error -->", error)
                },
                {
                    timeout: 2000, // 2 segundos tentando pegar a localização do usuário
                    enableHighAccuracy: true, // pega localização pelo GPS e não pelo wifi
                    maximumAge: 1000,
                }
            );
        }

        handleCurrentPosition();
        
    }, [])

    function handleLocationSelected( data, { geometry }) {
        const { location: { lat: latitude, lng: longitude } } = geometry;
        setDestination({
            latitude,
            longitude,
            title: data.structured_formatting.main_text
        })
    }

    function handleBack() {
        setDestination(null);
    }

  return (
    <Container>
        <MapView 
            style={{ flex: 1 }}
            region={region}
            showsUserLocation // mostra o icone do usuário
            loadingEnabled
            ref={refMapView}
        >
            { destination && (
                <>
                    <Directions 
                        origin={region}
                        destination={destination}
                        onReady={async (result) => {
                            console.log("Result ->", result )
                            setDuration(Math.floor(result.duration))
                            await refMapView.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: getPixelSize(50),
                                    left: getPixelSize(50),
                                    top: getPixelSize(50),
                                    bottom: getPixelSize(350)
                                }
                            }) // zoom na rota selecionada
                        }}
                    />
                    <Marker 
                        coordinate={destination} // com valores de horigem e destino
                        anchor={{ x: 0, y: 0}} // controla a posição da imagem de marcação no mapa
                        image={ markerImage } 
                    >
                        <LocationBox>
                            <LocationText>{destination.title}</LocationText>
                        </LocationBox>
                    </Marker>

                    <Marker 
                        coordinate={region} // com valores de horigem e destino
                        anchor={{ x: 0, y: 0}} // controla a posição da imagem de marcação no mapa
                    >
                        <LocationBox>
                            <LocationTimeBox>
                                <LocationTimeText>{ duration }</LocationTimeText>
                                <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                            </LocationTimeBox>
                            <LocationText>{ location }</LocationText>
                        </LocationBox>
                    </Marker>
                </>
            )}
        </MapView>

        { destination ? 
            <>
                <Back onPress={handleBack}>
                    <Image source={backImage} />
                </Back>
                <Details/> 
            </>
        : 
            <Search 
                onLocationSelected={handleLocationSelected}
            />
        }
    </Container>
  );
}
