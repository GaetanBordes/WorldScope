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
        Ion, Viewer, Cartesian3, Color, IonImageryProvider
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
        imageryProvider: false, // IMPORTANT pour éviter planète bleue
      });

      // Charge le Bing Maps Aerial with Labels
      IonImageryProvider.fromAssetId(3).then((provider) => {
        if (destroyed || !viewer || viewer.isDestroyed()) return;
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(provider);

        // Accès au globe uniquement si viewer valide
        if (viewer.scene && viewer.scene.globe) {
          viewer.scene.globe.enableLighting = false;
        }
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
          position: Cartesian3.fromDegrees(evt.lon, evt.lat),
          point: {
            pixelSize: 10,
            color: color.withAlpha(0.95),
            outlineColor: Color.BLACK,
            outlineWidth: 2,
          },
          description: `<strong>${evt.type || ""}</strong><br/>
                        <em>${evt.subType || ""}</em><br/>
                        <span>${evt.actor || ""}</span><br/>
                        ${evt.country}<br/>${evt.date}`,
        });
      });

      // Zoom auto si points
      if (incidents.length > 0) viewer.zoomTo(viewer.entities);
      else viewer.camera.flyHome(0);
    }

    return () => {
      destroyed = true;
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
    };
  }, [incidents]);

  return <div ref={containerRef} className="cesium-container" />;
}
