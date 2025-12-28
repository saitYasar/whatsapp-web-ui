import { useState, FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "common/context/auth";
import { useAppConfig } from "common/context/app-config";
import Icon from "common/components/icons";
import {
  Container,
  LoginCard,
  LogoWrapper,
  Logo,
  Title,
  SubTitle,
  Form,
  InputWrapper,
  Input,
  Button,
  ErrorMessage,
  FooterText,
  FooterLink,
  AdminButton,
} from "./styles";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { appName, appShortName } = useAppConfig();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(password);
      if (result.success) {
        // If admin, navigate to admin page, otherwise to home
        if (result.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.error || t("login.error"));
      }
    } catch (err) {
      setError(t("login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await login("65432");
      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.error || t("login.error"));
      }
    } catch (err) {
      setError(t("login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <LogoWrapper>
          <Logo id="whatsapp" />
        </LogoWrapper>
        <Title>{t("login.title", { appShortName })}</Title>
        <SubTitle>{t("login.subtitle", { appName })}</SubTitle>

        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoFocus
              disabled={isLoading}
            />
            <Icon id="lock" className="lock-icon" />
          </InputWrapper>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={isLoading || !password.trim()}>
            {isLoading ? t("login.loading") : t("login.button")}
          </Button>
        </Form>

        <AdminButton
          type="button"
          onClick={handleAdminLogin}
          disabled={isLoading}
        >
          {t("login.adminButton")}
        </AdminButton>

        <FooterText>
          {t("login.footer")}{" "}
          <FooterLink href="https://github.com/saitYasar" target="_blank">
            {t("login.footerLink")}
          </FooterLink>
        </FooterText>
      </LoginCard>
    </Container>
  );
}

