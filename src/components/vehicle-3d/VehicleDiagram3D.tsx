import { Suspense, useCallback, useRef } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import type { VehicleAreaMarker, VehicleType } from '@/types/checklist';
import { getVehicleModel, getVehicleLabel } from './VehicleModels';
import { DamageMarker3D } from './DamageMarker3D';
import { RotateCw } from 'lucide-react';

interface VehicleDiagram3DProps {
  markers: VehicleAreaMarker[];
  onAddMarker: (marker: VehicleAreaMarker) => void;
  onRemoveMarker: (id: string) => void;
  vehicleType: VehicleType;
}

// Loading component
const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <RotateCw className="w-8 h-8 animate-spin" />
      <span className="text-sm">Carregando modelo 3D...</span>
    </div>
  </Html>
);

// Scene component
const VehicleScene = ({ 
  vehicleType, 
  markers, 
  onAddMarker, 
  onRemoveMarker 
}: VehicleDiagram3DProps) => {
  
  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    
    const point = event.point;
    
    // Determine position based on click location
    let position: VehicleAreaMarker['position'] = 'top';
    
    if (point.z > 1.5) position = 'front';
    else if (point.z < -1.5) position = 'back';
    else if (point.x > 0.8) position = 'right';
    else if (point.x < -0.8) position = 'left';
    else if (point.y > 1) position = 'top';
    else position = 'bottom';
    
    const newMarker: VehicleAreaMarker = {
      id: `marker-${Date.now()}`,
      x: point.x,
      y: point.y,
      z: point.z,
      position,
    };
    
    onAddMarker(newMarker);
  }, [onAddMarker]);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.3} />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Vehicle model */}
      <group>
        {getVehicleModel(vehicleType, handlePointerDown)}
      </group>
      
      {/* Damage markers */}
      {markers.map((marker) => (
        <DamageMarker3D
          key={marker.id}
          marker={marker}
          onRemove={onRemoveMarker}
        />
      ))}
      
      {/* Ground shadow */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={15} 
        blur={2} 
        far={4} 
      />
      
      {/* Orbit controls for 360° rotation */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
        makeDefault
      />
    </>
  );
};

export const VehicleDiagram3D = ({ 
  markers, 
  onAddMarker, 
  onRemoveMarker, 
  vehicleType 
}: VehicleDiagram3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative w-full" ref={containerRef}>
      <p className="text-sm text-muted-foreground mb-3 text-center">
        Rotacione o <strong>{getVehicleLabel(vehicleType)}</strong> e clique para marcar áreas afetadas
      </p>
      
      <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-muted/30 to-muted/10 border border-border">
        <Canvas
          shadows
          camera={{ 
            position: [4, 3, 6], 
            fov: 45,
            near: 0.1,
            far: 100
          }}
          style={{ cursor: 'grab' }}
          onPointerDown={() => {
            if (containerRef.current) {
              containerRef.current.style.cursor = 'grabbing';
            }
          }}
          onPointerUp={() => {
            if (containerRef.current) {
              containerRef.current.style.cursor = 'grab';
            }
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <VehicleScene
              vehicleType={vehicleType}
              markers={markers}
              onAddMarker={onAddMarker}
              onRemoveMarker={onRemoveMarker}
            />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-muted-foreground">
          💡 Arraste para rotacionar • Scroll para zoom
        </p>
        {markers.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {markers.length} área(s) marcada(s) - clique para remover
          </p>
        )}
      </div>
    </div>
  );
};