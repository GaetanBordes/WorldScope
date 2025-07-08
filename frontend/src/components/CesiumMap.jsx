import { useEffect, useRef } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./CesiumMap.scss";

export default function CesiumMap({ incidents = [] }) {
  const containerRef = useRef();

  useEffect(() => {
    let viewer;

    if (containerRef.current && window.Cesium) {
      const {
        Ion,
        Viewer,
        Cartesian3,
        Color,
        IonImageryProvider,
      } = window.Cesium;

      Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

      // 1️⃣ Crée le Viewer sans imageryProvider (sinon bug planète bleue)
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
        imageryProvider: false, // <-- IMPORTANT !
      });

      // 2️⃣ Remplace le layer par Bing Maps Aerial with Labels
      IonImageryProvider.fromAssetId(3).then((provider) => {
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(provider);
      });

      // Lumière du soleil activée
      viewer.scene.globe.enableLighting = true;

      // Ajoute les incidents
      viewer.entities.removeAll();
      incidents.forEach(evt => {
        if (
          typeof evt.lat !== "number" ||
          typeof evt.lon !== "number" ||
          isNaN(evt.lat) ||
          isNaN(evt.lon)
        )
          return;

        const color =
          evt.type === "Battles"
            ? Color.YELLOW
            : evt.type === "Explosions/Remote violence"
            ? Color.RED
            : Color.BLACK;

        viewer.entities.add({
          position: Cartesian3.fromDegrees(evt.lon, evt.lat),
          point: {
            pixelSize: 8,
            color: color.withAlpha(0.9),
            outlineColor: Color.WHITE,
            outlineWidth: 1.5,
          },
          description: `<strong>${evt.type}</strong><br/>${evt.country}<br/>${evt.date}`,
        });
      });

      if (incidents.length > 0) viewer.zoomTo(viewer.entities);
      else viewer.camera.flyHome(0);
    }

    return () => {
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
    };
  }, [incidents]);

  return <div ref={containerRef} className="cesium-container" />;
}
