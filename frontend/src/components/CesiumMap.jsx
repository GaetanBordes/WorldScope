import { useEffect, useRef } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./CesiumMap.scss";

const TYPE_COLORS = {
  "Batailles": "YELLOW",
  "Émeutes": "MAGENTA",
  "Protestations": "CYAN",
  "Violences contre les civils": "RED",
};

export default function CesiumMap({ incidents = [] }) {
  const containerRef = useRef();

  useEffect(() => {
    let viewer;
    let destroyed = false; // Flag propre

    if (containerRef.current && window.Cesium) {
      const {
        Ion,
        Viewer,
        Cartesian3,
        Color,
        IonImageryProvider,
      } = window.Cesium;

      Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

      viewer = new Viewer(containerRef.current, {
        baseLayerPicker: false,
        animation: false,
        timeline: false,
        sceneModePicker: false,
        homeButton: true,
        navigationHelpButton: true,
        infoBox: true,
        sceneMode: window.Cesium.SceneMode.SCENE3D,
        shouldAnimate: true,
        imageryProvider: false,
      });

      // Limite de zoom/dézoom
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 18000000;

      // 1️⃣ Bing Aerial as fond
      IonImageryProvider.fromAssetId(3).then(provider => {
        if (destroyed || !viewer || viewer.isDestroyed()) return;
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(provider);

        // 2️⃣ Ajoute Labels Only en overlay (au-dessus)
        IonImageryProvider.fromAssetId(2411391).then(labelsProvider => {
          if (destroyed || !viewer || viewer.isDestroyed()) return;
          viewer.imageryLayers.addImageryProvider(labelsProvider);
        });
      });

      // 3️⃣ Google Photorealistic 3D Tiles
      try {
        viewer.scene.primitives.add(
          // eslint-disable-next-line new-cap
          new window.Cesium.Cesium3DTileset({
            assetId: 2275207, // Google Photorealistic 3D Tiles
          })
        );
      } catch {
        // ignore si indisponible
      }

      // 🏠 Surcharge le bouton "Home" pour aller sur Paris
      const paris = window.Cesium.Cartesian3.fromDegrees(2.3522, 48.8566, 1800000); // (lng, lat, hauteur en mètres)
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true;
        viewer.camera.flyTo({
          destination: paris,
          duration: 1.6
        });
      });

      // Points
      viewer.entities.removeAll();
      incidents.forEach(evt => {
        if (
          typeof evt.lat !== "number" ||
          typeof evt.lon !== "number" ||
          isNaN(evt.lat) || isNaN(evt.lon)
        ) return;
        const colorKey = TYPE_COLORS[evt.type] || "WHITE";
        const color = Color[colorKey] || Color.WHITE;

        viewer.entities.add({
          name: evt.country || "Pays inconnu",
          position: Cartesian3.fromDegrees(evt.lon, evt.lat),
          point: {
            pixelSize: 10,
            color: color.withAlpha(0.95),
            outlineColor: Color.BLACK,
            outlineWidth: 2,
          },
          description: `
            <b>${evt.type || ""}</b><br/>
            ${evt.date || ""}
          `,
        });
      });

      // Zoom auto si points, sinon Home (= Paris)
      if (incidents.length > 0) viewer.zoomTo(viewer.entities);
      else viewer.camera.flyTo({ destination: paris, duration: 1.7 });
    }

    return () => {
      destroyed = true;
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
    };
  }, [incidents]);

  return <div ref={containerRef} className="cesium-container" />;
}
