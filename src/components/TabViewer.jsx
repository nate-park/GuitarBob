import React, { useEffect, useRef } from 'react';

export default function TabViewer({ gpFile }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !gpFile) return;

    const loadAlphaTab = async () => {
      try {
        // Dynamically import alphaTab
        const { AlphaTabApi } = await import('@coderline/alphatab');

        // Clean up previous instance
        if (apiRef.current) {
          try {
            apiRef.current.destroy();
          } catch (e) {
            console.log('Error destroying previous API:', e);
          }
        }

        // Create settings
        const settings = {
          core: {
            file: gpFile,
            logLevel: 2,
          },
          display: {
            scale: 100,
            layoutMode: 1, // horizontal
            storeVisualizationSettings: false,
          },
          player: {
            enablePlayer: true,
            enableCursor: true,
            beatGapBar: 0,
          },
        };

        // Initialize alphaTab
        apiRef.current = new AlphaTabApi(containerRef.current, settings);

        // Setup event handlers
        apiRef.current.scoreLoaded.on((score) => {
          console.log('Score loaded:', score.title);
        });

        apiRef.current.error.on((error) => {
          console.error('alphaTab error:', error);
        });
      } catch (error) {
        console.error('Failed to load alphaTab:', error);
      }
    };

    loadAlphaTab();

    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.destroy();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        apiRef.current = null;
      }
    };
  }, [gpFile]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg p-4 overflow-x-auto">
      <div
        ref={containerRef}
        className="at-wrap at-mobile"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
