import styled from "styled-components/native";
import theme from "./theme";

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

export const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: ${theme.typography.body.fontSize}px;
  margin-top: ${theme.spacing.large}px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.textLight};
  font-size: ${theme.typography.body.fontSize}px;
  margin-top: ${theme.spacing.large}px;
`;

