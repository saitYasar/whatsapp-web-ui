import { useTranslation } from "react-i18next";
import { useAppConfig } from "common/context/app-config";
import {
  Container,
  EncryptionIcon,
  Link,
  Logo,
  LogoWrapper,
  Progress,
  SubTitle,
  Title,
} from "./styles";

type SplashPageProps = {
  progress: number;
};

export default function SplashPage(props: SplashPageProps) {
  const { progress } = props;
  const { t } = useTranslation();
  const { appShortName } = useAppConfig();

  return (
    <Container>
      <LogoWrapper>
        <Logo id="whatsapp" />
      </LogoWrapper>
      <Progress progess={progress} />
      <Title>{t("splash.title", { appShortName })}</Title>
      <SubTitle>
        <EncryptionIcon id="lock" /> {t("splash.subtitle")}{" "}
        <Link href="https://github.com/saitYasar" target="_blank">
          {t("splash.builtBy")}
        </Link>{" "}
        ❤️.
      </SubTitle>
    </Container>
  );
}
