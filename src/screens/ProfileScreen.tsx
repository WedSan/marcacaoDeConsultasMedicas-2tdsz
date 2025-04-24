import React from 'react';
import styled from 'styled-components/native';
import { Button, Text } from 'react-native-elements';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthentication } from '../components/context/AuthenticationContext';

type RootStackParamList = {
  Home: undefined;
  CreateAppointment: undefined;
  Profile: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

  const {user} = useAuthentication();
  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Meu Perfil</HeaderTitle>
      </HeaderContainer>

      <Content>
        <Button
          title="Voltar"
          icon={{
            name: 'arrow-left',
            type: 'font-awesome',
            size: 20,
            color: 'white'
          }}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: 20
          }}
          onPress={() => navigation.goBack()}
        />

        <ProfileInfo>
          <Avatar source={{ uri: 'https://via.placeholder.com/150' }} />
          <Name>Nome do Usuário:{' '} <Text style={{textTransform: 'uppercase', fontWeight: 'bold'}}>{user?.name}</Text></Name>
          <Email>{user?.email}</Email>
        </ProfileInfo>
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

const ProfileInfo = styled.View`
  align-items: center;
  margin-top: ${theme.spacing.large}px;
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: ${theme.spacing.medium}px;
`;

const Name = styled.Text`
  font-size: ${theme.typography.title.fontSize}px;
  font-weight: ${theme.typography.title.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

const Email = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

export default ProfileScreen;
