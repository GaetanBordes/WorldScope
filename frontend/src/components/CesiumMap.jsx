import { useEffect, useRef } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./CesiumMap.scss";

export default function CesiumMap({ incidents = [] }) {
  const containerRef = useRef();

  useEffect(() => {
    let viewer;
    let isMounted = true;

    if (containerRef.current && window.Cesium) {
      const {
        Ion,
        Viewer,
        Cartesian3,
        Color,
        IonImageryProvider
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
        imageryProvider: window.Cesium.IonImageryProvider.fromAssetId(2), // Bing Maps Aerial
      });

      // Ajoute la couche de labels (Bing Maps)
      window.Cesium.IonImageryProvider.fromAssetId(2411391).then((provider) => {
        if (isMounted && viewer && !viewer.isDestroyed()) {
          viewer.imageryLayers.addImageryProvider(provider);
        }
      });

      // Lumière du soleil
      viewer.scene.globe.enableLighting = true;

      // Ajoute les incidents
      viewer.entities.removeAll();
      incidents.forEach(evt => {
        if (
          typeof evt.lat !== "number" ||
          typeof evt.lon !== "number" ||
          isNaN(evt.lat) ||
          isNaN(evt.lon)
        ) return;

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
      isMounted = false;
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
    };
  }, [incidents]);

  return <div ref={containerRef} className="cesium-container" />;
}
