import { useTranslation } from "react-i18next";
import Sidebar from "../components/sidebar";
import { App, Content, Message } from "./styles";

export default function ChatLayout(props: { children: any }) {
  const { t } = useTranslation();

  return (
    <App>
      <Message>{t("layout.desktopOnly")}</Message>
      <Content>
        <Sidebar />
        {props.children}
      </Content>
    </App>
  );
}
