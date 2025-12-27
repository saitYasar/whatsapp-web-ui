import Icon from "common/components/icons";
import OptionsMenu from "pages/chat/components/option-menu";
import {
  Action,
  Actions,
  actionStyles,
  Avatar,
  AvatarWrapper,
  Container,
  Name,
  ProfileWrapper,
  Subtitle,
} from "./styles";

type HeaderProps = {
  onSearchClick: Function;
  onNotesClick?: Function;
  title: string;
  image: string;
  subTitle: string;
};

export default function Header(props: HeaderProps) {
  const { title, subTitle, image, onSearchClick, onNotesClick } = props;

  return (
    <Container>
      <AvatarWrapper>
        <Avatar src={image} />
      </AvatarWrapper>
      <ProfileWrapper>
        <Name>{title}</Name>
        {subTitle && <Subtitle>{subTitle}</Subtitle>}
      </ProfileWrapper>
      <Actions>
        <Action onClick={onSearchClick}>
          <Icon id="search" className="icon search-icon" />
        </Action>
        {onNotesClick && (
          <Action onClick={onNotesClick}>
            <Icon id="attachDocument" className="icon" />
          </Action>
        )}
        <OptionsMenu
          styles={actionStyles}
          ariaLabel="Menu"
          iconId="menu"
          iconClassName="icon"
          options={[
            "Select Messages",
            "Mute notifications",
            "Clear messages",
            "Delete chat",
          ]}
        />
      </Actions>
    </Container>
  );
}
