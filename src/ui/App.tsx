import { useState } from "react";
import { Admin } from "./admin/Admin";
import { ClassRoom } from "./catch/ClassRoom";

type Screen = "classroom" | "admin";

function screenFromHash(): Screen {
  return location.hash.startsWith("#admin") ? "admin" : "classroom";
}

function clearHash(): void {
  history.replaceState(null, "", location.pathname + location.search);
}

export function App() {
  const [screen, setScreen] = useState<Screen>(screenFromHash);

  if (screen === "admin") {
    return (
      <Admin
        onExit={() => {
          clearHash();
          setScreen("classroom");
        }}
      />
    );
  }

  return (
    <ClassRoom
      initialCode={location.hash.match(/^#lop-?(\d{4})/)?.[1]}
      mode="home"
      adminKey={null}
      onExit={() => {
        clearHash();
        window.location.reload();
      }}
    />
  );
}
