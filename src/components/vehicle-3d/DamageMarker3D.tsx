import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { Html } from '@react-three/drei';
import { X } from 'lucide-react';
import type { VehicleAreaMarker } from '@/types/checklist';

interface DamageMarker3DProps {
  marker: VehicleAreaMarker;
  onRemove: (id: string) => void;
}

export const DamageMarker3D = ({ marker, onRemove }: DamageMarker3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position = new Vector3(marker.x, marker.y, marker.z ?? 0);
  
  return (
    <group position={position}>
      {/* Marker sphere */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(marker.id);
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#dc2626" : "#ef4444"} 
          emissive={hovered ? "#dc2626" : "#ef4444"}
          emissiveIntensity={hovered ? 0.8 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Pulsing ring effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.22, 24]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
      </mesh>
      
      {/* Remove button on hover */}
      {hovered && (
        <Html
          position={[0.3, 0.3, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="flex items-center justify-center w-6 h-6 bg-destructive rounded-full shadow-lg animate-scale-in">
            <X className="w-4 h-4 text-destructive-foreground" />
          </div>
        </Html>
      )}
    </group>
  );
};