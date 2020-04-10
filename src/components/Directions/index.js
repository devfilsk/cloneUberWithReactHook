import React, { useEffect } from 'react';
import MapViewDirections from 'react-native-maps-directions';


// import { Container } from './styles';

export default function Directions({ destination, origin, onReady}) {
  useEffect(() => {
    console.log("Destination -> ", destination)
  }, [])
  return (
    <MapViewDirections
        destination={destination.destination}
        origin={origin}
        onReady={onReady}
        apikey="AIzaSyCu6wanm5hbipWrZIC1sU6fHOIg-IDdIcM"
        strokeWidth={3} // largura da linha que liga os pontos
        strokeColor="#222"
    />
  );
}
