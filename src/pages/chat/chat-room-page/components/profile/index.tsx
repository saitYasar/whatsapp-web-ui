import { useTranslation } from "react-i18next";
import Icon from "common/components/icons";
import {
  AboutItem,
  ActionSection,
  ActionText,
  Avatar,
  AvatarWrapper,
  Heading,
  HeadingWrapper,
  MediaButton,
  MediaImage,
  MediaImagesWrapper,
  PersonalInfo,
  ProfileName,
  Section,
  Wrapper,
} from "./styles";

type ProfileSectionProps = {
  name: string;
  image: string;
};

export default function ProfileSection(props: ProfileSectionProps) {
  const { name, image } = props;
  const { t } = useTranslation();

  return (
    <Wrapper>
      <PersonalInfo>
        <AvatarWrapper>
          <Avatar src={image} alt="User Profile" />
        </AvatarWrapper>
        <ProfileName>{name}</ProfileName>
      </PersonalInfo>

      <Section>
        <HeadingWrapper>
          <Heading>{t("profile.mediaLinksDocuments")}</Heading>
          <MediaButton>
            <Icon id="rightArrow" className="icon" />
          </MediaButton>
        </HeadingWrapper>
        <MediaImagesWrapper>
          <MediaImage src="/assets/images/placeholder.jpeg" alt="Media" />
          <MediaImage src="/assets/images/placeholder.jpeg" alt="Media" />
          <MediaImage src="/assets/images/placeholder.jpeg" alt="Media" />
        </MediaImagesWrapper>
      </Section>

      <Section>
        <HeadingWrapper>
          <Heading>{t("profile.aboutPhoneNumber")}</Heading>
        </HeadingWrapper>
        <ul>
          <AboutItem>
            Everyone should learn how to program because it teaches you how to think.
          </AboutItem>
          <AboutItem>+123456789</AboutItem>
        </ul>
      </Section>

      <ActionSection>
        <Icon id="block" className="icon" />
        <ActionText>{t("profile.block")}</ActionText>
      </ActionSection>
      <ActionSection>
        <Icon id="thumbsDown" className="icon" />
        <ActionText>{t("profile.reportContact")}</ActionText>
      </ActionSection>
      <ActionSection>
        <Icon id="delete" className="icon" />
        <ActionText>{t("profile.deleteChat")}</ActionText>
      </ActionSection>
    </Wrapper>
  );
}
