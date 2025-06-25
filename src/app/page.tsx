'use client';

import { useEffect, useState } from "react";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from "firebase/database";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import Logo77Seguros from "../assets/seguros77";
import * as prismic from '@prismicio/client'
import LogoGrande from "@/assets/seguros77All";
import BGImg from "@/assets/bgImg";

const Home = () => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_apiKey,
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    databaseURL: process.env.NEXT_PUBLIC_databaseURL,
    projectId: process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_appId,
    measurementId: process.env.NEXT_PUBLIC_measurementId,
  };
  const firebase = initializeApp(firebaseConfig);
  const database = getDatabase(firebase);
  const client = prismic.createClient('leads');


  const [fila, setFila] = useState<string>();
  const [dataConsultor, setDataConsultor] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  function enviarWhatsApp(numero: string, mensagem = "") {
    const mensagemEncode = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numero}?text=${mensagemEncode}`;

    window.open(url, "_blank");
  }


  const salvarEvento = async () => {
    const campanha = await client.getSingle('campanha_nome');
    if (fila || fila === '1') {
      enviarWhatsApp(dataConsultor?.representante_numero, `Olá!
Gostaria de fazer uma cotação do meu veículo, pode me ajudar?`);

      logEvent(analytics, `${campanha?.data?.campanha_nome|| 'consultorClick'}`, {
        consultor_id: dataConsultor?.representante_nome
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(database, "contador"));
      setFila(snapshot.val());
      const numeroDeConsultores = (await client.getAllByType('consultor')).length
      if (snapshot.val() == numeroDeConsultores) {
        const novoContador = 1;
        await update(ref(database), { contador: novoContador });
      } else {
        const contadorSnap = await get(ref(database, "contador"));
        const contadorAtual = contadorSnap.val();
        const novoContador = contadorAtual + 1;

        await update(ref(database), { contador: novoContador });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchConsultor = async () => {
      if (!fila) return;

      try {
        const responseConsultor: any = await client.getByUID('consultor', String(fila));
        setDataConsultor(responseConsultor?.data);
      } catch (error) {
        console.error('Erro ao buscar consultor:', error); ''
      }
    }

    fetchConsultor()
  }, [fila]);


  useEffect(() => {
    const initAnalytics = async () => {
      const supported = await isSupported();
      if (supported) {
        const analyticsInstance = getAnalytics(firebase);
        setAnalytics(analyticsInstance);
      } else {
        console.log("Firebase Analytics não suportado neste ambiente.");
      }
    };

    initAnalytics();
  }, []);

  return (
    <div className="home-container">
      <div className={`bgEffect ${dataConsultor ? 'animation' : ''}`} />
      {
        dataConsultor
          ? (
            <div className={`dashboard ${dataConsultor ? 'cardAnimation' : ''}`}>
              <img src={dataConsultor?.representante_imagem.url} alt="Representante Imagem" />
              <BGImg className="bgImg" />
              <h2 className="dashboard-title">{dataConsultor?.representante_nome}</h2>
              <button data-consultor-id={dataConsultor?.representante_nome} onClick={salvarEvento} className="talk-btn">Falar com representante</button>
              <h1 className="page-icon"><LogoGrande /></h1>
            </div>
          )
          : <Logo77Seguros className="loading-icon" />
      }

    </div>
  );
};

export default Home;
