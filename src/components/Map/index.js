import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import Search from '../Search';
import Directions from '../Directions';

import { Container } from './styles';

export default function Map() {

    const [ region, setRegion ] = useState(null);
    const [ destination, setDestination ] = useState(null);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude }}) => { // success
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
    }, [])

    function handleLocationSelected( data, { geometry }) {
        const { location: { lat: latitude, lng: longitude } } = geometry;
        setDestination({
            destination: {
                latitude,
                longitude,
                title: data.structured_formatting.main_text
            }
        })
    }

  return (
    <Container>
        <MapView 
            style={{ flex: 1 }}
            region={region}
            showsUserLocation // mostra o icone do usuário
            loadingEnabled
        >
            { destination && (
                <Directions 
                    origin={region}
                    destination={destination}
                    onReady={() => {
                        
                    }}
                />
            )}
        </MapView>
        <Search 
            onLocationSelected={handleLocationSelected}
        />
    </Container>
  );
}
