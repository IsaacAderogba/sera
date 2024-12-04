import { PropsWithChildren } from "react";
import {
  PlaylistProvider,
  PlaylistSongProvider,
  ProfileProvider,
  SongProvider
} from "./useProviders";

export const DataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ProfileProvider>
      <PlaylistProvider>
        <SongProvider>
          <PlaylistSongProvider>{children}</PlaylistSongProvider>
        </SongProvider>
      </PlaylistProvider>
    </ProfileProvider>
  );
};
