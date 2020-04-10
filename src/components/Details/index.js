import React from 'react';

import { Container, TypeTitle, TypeDesciption, TypeImage, RequestButton, RequestButtonText } from './styles';

import uberx from '~/assets/uberx.png';

export default function Details() {
  return (
    <Container>
        <TypeTitle>Popular</TypeTitle>
        <TypeDesciption>Viagens baratas para o dia a dia</TypeDesciption>
        <TypeImage
            source={uberx}
        />
        <TypeTitle>UberX</TypeTitle>
        <TypeTitle>R$ 6,00</TypeTitle>
        <RequestButton>
            <RequestButtonText>SOLICITAR UBERX</RequestButtonText>
        </RequestButton>
    </Container>
  );
}
