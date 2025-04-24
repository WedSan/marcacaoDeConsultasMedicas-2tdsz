import React, { useState } from "react";
import styled from "styled-components/native";
import {
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import theme from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigator";
import { useAuthentication } from "../components/context/AuthenticationContext";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC = () => {
  const { signIn } = useAuthentication();
  const navigation = useNavigation<LoginScreenProps["navigation"]>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signIn({ email, password });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Text
        style={{
          marginTop: 20,
          textAlign: "center" as const,
          color: theme.colors.text,
        }}
      >
        Available Credentials: admin@andrezitosmedic.com / password: abacaxi | joao@andrezitosmedic.com,
        maria@andrezitosmedic.com, pedro@andrezitosmedic.com / password for doctors: pera
      </Text>
      <Header>
        <Title>Welcome Back!</Title>
        <Subtitle>Sign in to continue</Subtitle>
      </Header>

      <Form>
        <Input
          placeholder="Email"
          placeholderTextColor={theme.colors.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          placeholderTextColor={theme.colors.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <ErrorText>{error}</ErrorText> : null}

        <LoginButton onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <LoginButtonText>Sign In</LoginButtonText>
          )}
        </LoginButton>

        <RegisterLink onPress={() => navigation.navigate("Register")}>
          <RegisterLinkText>Don't have an account? Register</RegisterLinkText>
        </RegisterLink>
      </Form>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: 20px;
  justify-content: center;
`;

const Header = styled.View`
  margin-bottom: 40px;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textLight};
  margin-top: 8px;
`;

const Form = styled.View`
  width: 100%;
`;

const Input = styled.TextInput`
  background-color: ${theme.colors.inputBackground};
  color: ${theme.colors.text};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 16px;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const LoginButtonText = styled.Text`
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: bold;
`;

const RegisterLink = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

const RegisterLinkText = styled.Text`
  color: ${theme.colors.secondary};
  font-size: 14px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
`;

export default LoginScreen;
