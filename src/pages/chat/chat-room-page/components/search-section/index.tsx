import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfig } from "common/context/app-config";
import { Content, Search } from "./styles";

export default function SearchSection() {
  const { t } = useTranslation();
  const { appName } = useAppConfig();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: API call will be implemented here
    // Example: searchMessages(query);
  };

  return (
    <React.Fragment>
      <Search
        placeholder={t("chatRoom.searchMessages", { appName })}
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
      />
      <Content>
        {searchQuery && (
          <div>
            {/* TODO: Display search results from API */}
            Searching for: {searchQuery}
          </div>
        )}
      </Content>
    </React.Fragment>
  );
}
