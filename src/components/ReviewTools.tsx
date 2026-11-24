import { useEffect, useState, useSyncExternalStore } from "react";
import { Agentation } from "agentation";
import "../styles/review-tools.css";

const desktopQuery = "(hover: hover) and (pointer: fine)";
function subscribeDesktop(listener: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
function desktopSnapshot() {
  return window.matchMedia(desktopQuery).matches;
}
function storageAvailable() {
  try {
    const key = "dickisserie.review-probe";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export default function ReviewTools() {
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    desktopSnapshot,
    () => false,
  );
  const [canStore] = useState(storageAvailable);
  const [container, setContainer] = useState<HTMLElement | null>(() =>
    document.querySelector<HTMLDialogElement>("dialog[open]"),
  );

  useEffect(() => {
    const root = document.getElementById("root");
    if (!desktop || !canStore || !root) return;
    const observer = new MutationObserver(() => {
      setContainer(root.querySelector<HTMLDialogElement>("dialog[open]"));
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    return () => observer.disconnect();
  }, [desktop, canStore]);

  if (!desktop || !canStore) return null;
  return (
    <Agentation
      appName="DICKISSERIE"
      className="dickisserie-review-toolbar"
      enableKeyboardShortcuts={false}
      portalContainer={container}
    />
  );
}
