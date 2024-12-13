import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { client } from "../../utilities/client";

export const NavigateBackButton: React.FC = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const location = useLocation();
  useEffect(() => {
    client.invoke("canGoBack").then(result => setCanGoBack(result));
  }, [location]);

  return (
    <Button
      icon
      variant="ghost"
      tabIndex={canGoBack ? 0 : -1}
      disabled={!canGoBack}
      onClick={async () => {
        if (canGoBack) await client.invoke("goBack");
      }}
    >
      <ArrowLeftIcon width={20} />
    </Button>
  );
};

export const NavigateForwardButton: React.FC = () => {
  const [canGoForward, setCanGoForward] = useState(false);
  const location = useLocation();
  useEffect(() => {
    client.invoke("canGoForward").then(result => setCanGoForward(result));
  }, [location]);

  return (
    <Button
      icon
      variant="ghost"
      tabIndex={canGoForward ? 0 : -1}
      disabled={!canGoForward}
      onClick={async () => {
        if (canGoForward) await client.invoke("goForward");
      }}
    >
      <ArrowRightIcon width={20} />
    </Button>
  );
};
