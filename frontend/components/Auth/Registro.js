import React, { useState } from 'react';
import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import axios from 'axios';
import { Redirect } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Registro = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handlePasswordClick = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordClick = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };


  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      NotificationManager.warning('Por Favor Rellene todos los campos', '', 5000);
      setPicLoading(false);
      return;
    }

    
    if (password !== confirmpassword) {
      NotificationManager.warning('Las contraseñas no coinciden', '', 5000);
      setPicLoading(false);
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      NotificationManager.success('Registro exitoso', 'Éxito', 5000);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setPicLoading(false);
      setRedirect(true);
    } catch (error) {
      NotificationManager.error('Ocurrió un error', error.response.data.message, 5000);
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      NotificationManager.warning('Por favor, elija una imagen', '', 5000);
      return;
    }
    console.log(pics);
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'dcmn7oweb');
      fetch('https://api.cloudinary.com/v1_1/dcmn7oweb/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      NotificationManager.warning('Por favor, seleccione una imagen', '', 5000);
      setPicLoading(false);
      return;
    }
  };

  if (redirect) {
    return <Redirect to="/chats" />;
  }

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Nombre de usuario</FormLabel>
        <Input placeholder="Ingrese su nombre" onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Correo Electrónico</FormLabel>
        <Input type="email" placeholder="Ingrese su correo electrónico" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel htmlFor="password">Contraseña</FormLabel>
        <InputGroup size="md">
          <Input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            placeholder="Ingrese su contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordClick}>
              {passwordVisible ? 'Ocultar' : 'Mostrar'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirmar Contraseña</FormLabel>
        <InputGroup size="md">
          <Input
            type={confirmPasswordVisible ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleConfirmPasswordClick}>
              {confirmPasswordVisible ? 'Ocultar' : 'Mostrar'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Suba su foto de perfil</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
      </FormControl>
      <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={picLoading}>
        Registrase
      </Button>
      <NotificationContainer />
    </VStack>
  );
};

export default Registro;
