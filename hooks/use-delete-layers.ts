import { useSelf, useMutation } from "@liveblocks/react";
import { updateConnectors } from "@/lib/connectors";

export const useDeleteLayers = () => {
  const selection = useSelf((me) => me.presence.selection)!;
  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayersIds = storage.get("layerIds");
      for (const id of selection) {
        liveLayers.delete(id);

        const index = liveLayersIds.indexOf(id);

        if (index !== -1) {
          liveLayersIds.delete(index);
        }
      }
      // Detach connectors that pointed at the deleted layers.
      updateConnectors(liveLayers, new Set(selection));
      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selection]
  );
};
