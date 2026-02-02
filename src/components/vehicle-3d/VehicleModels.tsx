import { useRef } from 'react';
import { Mesh, Group } from 'three';
import type { VehicleType } from '@/types/checklist';

interface VehicleModelProps {
  onPointerDown?: (event: any) => void;
}

// Car/Sedan model
export const CarModel = ({ onPointerDown }: VehicleModelProps) => {
  const groupRef = useRef<Group>(null);
  
  return (
    <group ref={groupRef} onPointerDown={onPointerDown}>
      {/* Main body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 4]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 0.85, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.5, 2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Windshield front */}
      <mesh position={[0, 0.85, 0.85]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.5, 0.02, 0.8]} />
        <meshStandardMaterial color="#a0d8ef" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Windshield back */}
      <mesh position={[0, 0.85, -1.4]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[1.4, 0.02, 0.7]} />
        <meshStandardMaterial color="#a0d8ef" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[0.81, 0.85, -0.3]}>
        <boxGeometry args={[0.02, 0.35, 1.6]} />
        <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.81, 0.85, -0.3]}>
        <boxGeometry args={[0.02, 0.35, 1.6]} />
        <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
      </mesh>
      
      {/* Wheels */}
      <Wheel position={[0.8, 0.15, 1.3]} />
      <Wheel position={[-0.8, 0.15, 1.3]} />
      <Wheel position={[0.8, 0.15, -1.3]} />
      <Wheel position={[-0.8, 0.15, -1.3]} />
      
      {/* Headlights */}
      <mesh position={[0.5, 0.4, 2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.5, 0.4, 2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Tail lights */}
      <mesh position={[0.6, 0.4, -2]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.6, 0.4, -2]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Side mirrors */}
      <mesh position={[0.95, 0.85, 0.5]}>
        <boxGeometry args={[0.15, 0.08, 0.1]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      <mesh position={[-0.95, 0.85, 0.5]}>
        <boxGeometry args={[0.15, 0.08, 0.1]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    </group>
  );
};

// Wheel component
const Wheel = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.25, 0.25, 0.2, 24]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.15, 0.15, 0.22, 8]} />
      <meshStandardMaterial color="#6b7280" metalness={0.8} />
    </mesh>
  </group>
);

// Truck model
export const TruckModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Cabin */}
    <mesh position={[0, 0.8, 2]} castShadow>
      <boxGeometry args={[2, 1.2, 1.5]} />
      <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.5} />
    </mesh>
    
    {/* Cabin windshield */}
    <mesh position={[0, 1.1, 2.76]} rotation={[0.2, 0, 0]}>
      <boxGeometry args={[1.8, 0.6, 0.05]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.6} />
    </mesh>
    
    {/* Cargo area */}
    <mesh position={[0, 0.9, -1]} castShadow>
      <boxGeometry args={[2.2, 1.6, 4.5]} />
      <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.7} />
    </mesh>
    
    {/* Front wheels */}
    <Wheel position={[1, 0.3, 2]} />
    <Wheel position={[-1, 0.3, 2]} />
    
    {/* Rear wheels (dual) */}
    <Wheel position={[1, 0.3, -2]} />
    <Wheel position={[-1, 0.3, -2]} />
    <Wheel position={[1, 0.3, -1]} />
    <Wheel position={[-1, 0.3, -1]} />
    
    {/* Headlights */}
    <mesh position={[0.6, 0.5, 2.76]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[-0.6, 0.5, 2.76]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[1.15, 1.2, 2.3]}>
      <boxGeometry args={[0.2, 0.15, 0.15]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-1.15, 1.2, 2.3]}>
      <boxGeometry args={[0.2, 0.15, 0.15]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </group>
);

// Van model
export const VanModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Main body */}
    <mesh position={[0, 0.8, 0]} castShadow>
      <boxGeometry args={[1.9, 1.4, 4.5]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.4} roughness={0.5} />
    </mesh>
    
    {/* Front windshield */}
    <mesh position={[0, 1.1, 2.3]} rotation={[0.3, 0, 0]}>
      <boxGeometry args={[1.7, 0.7, 0.05]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.6} />
    </mesh>
    
    {/* Side windows front */}
    <mesh position={[0.96, 1, 1.5]}>
      <boxGeometry args={[0.02, 0.5, 0.8]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
    </mesh>
    <mesh position={[-0.96, 1, 1.5]}>
      <boxGeometry args={[0.02, 0.5, 0.8]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
    </mesh>
    
    {/* Rear windows */}
    <mesh position={[0.4, 1, -2.26]}>
      <boxGeometry args={[0.5, 0.4, 0.02]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
    </mesh>
    <mesh position={[-0.4, 1, -2.26]}>
      <boxGeometry args={[0.5, 0.4, 0.02]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
    </mesh>
    
    {/* Sliding door line */}
    <mesh position={[0.96, 0.6, 0]}>
      <boxGeometry args={[0.02, 0.8, 0.02]} />
      <meshStandardMaterial color="#9ca3af" />
    </mesh>
    <mesh position={[-0.96, 0.6, 0]}>
      <boxGeometry args={[0.02, 0.8, 0.02]} />
      <meshStandardMaterial color="#9ca3af" />
    </mesh>
    
    {/* Wheels */}
    <Wheel position={[0.9, 0.2, 1.5]} />
    <Wheel position={[-0.9, 0.2, 1.5]} />
    <Wheel position={[0.9, 0.2, -1.5]} />
    <Wheel position={[-0.9, 0.2, -1.5]} />
    
    {/* Headlights */}
    <mesh position={[0.6, 0.5, 2.26]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[-0.6, 0.5, 2.26]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[1.05, 1.2, 1.8]}>
      <boxGeometry args={[0.15, 0.1, 0.1]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-1.05, 1.2, 1.8]}>
      <boxGeometry args={[0.15, 0.1, 0.1]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </group>
);

// Furgao (cargo van) model
export const FurgaoModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Cabin */}
    <mesh position={[0, 0.7, 1.8]} castShadow>
      <boxGeometry args={[1.8, 1.2, 1.4]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.4} roughness={0.5} />
    </mesh>
    
    {/* Cargo box */}
    <mesh position={[0, 0.9, -0.8]} castShadow>
      <boxGeometry args={[2, 1.8, 3.5]} />
      <meshStandardMaterial color="#e5e7eb" metalness={0.2} roughness={0.8} />
    </mesh>
    
    {/* Windshield */}
    <mesh position={[0, 1, 2.51]} rotation={[0.2, 0, 0]}>
      <boxGeometry args={[1.6, 0.6, 0.05]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.6} />
    </mesh>
    
    {/* Rear door line */}
    <mesh position={[0, 0.9, -2.56]}>
      <boxGeometry args={[0.02, 1.4, 0.02]} />
      <meshStandardMaterial color="#9ca3af" />
    </mesh>
    
    {/* Door handles */}
    <mesh position={[0.1, 0.8, -2.56]}>
      <boxGeometry args={[0.05, 0.15, 0.03]} />
      <meshStandardMaterial color="#6b7280" metalness={0.8} />
    </mesh>
    <mesh position={[-0.1, 0.8, -2.56]}>
      <boxGeometry args={[0.05, 0.15, 0.03]} />
      <meshStandardMaterial color="#6b7280" metalness={0.8} />
    </mesh>
    
    {/* Wheels */}
    <Wheel position={[0.9, 0.2, 1.5]} />
    <Wheel position={[-0.9, 0.2, 1.5]} />
    <Wheel position={[0.9, 0.2, -1.8]} />
    <Wheel position={[-0.9, 0.2, -1.8]} />
    
    {/* Headlights */}
    <mesh position={[0.6, 0.4, 2.51]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[-0.6, 0.4, 2.51]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
  </group>
);

// Bus model
export const BusModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Main body */}
    <mesh position={[0, 1, 0]} castShadow>
      <boxGeometry args={[2.4, 1.8, 8]} />
      <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.5} />
    </mesh>
    
    {/* Front windshield */}
    <mesh position={[0, 1.4, 4.01]} rotation={[0.1, 0, 0]}>
      <boxGeometry args={[2.2, 1, 0.05]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.6} />
    </mesh>
    
    {/* Side windows row */}
    {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((z, i) => (
      <group key={i}>
        <mesh position={[1.21, 1.2, z]}>
          <boxGeometry args={[0.02, 0.6, 0.8]} />
          <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
        </mesh>
        <mesh position={[-1.21, 1.2, z]}>
          <boxGeometry args={[0.02, 0.6, 0.8]} />
          <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
        </mesh>
      </group>
    ))}
    
    {/* Door */}
    <mesh position={[1.21, 0.8, 3]}>
      <boxGeometry args={[0.02, 1.2, 0.8]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    
    {/* Rear window */}
    <mesh position={[0, 1.3, -4.01]}>
      <boxGeometry args={[1.8, 0.8, 0.05]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
    </mesh>
    
    {/* Wheels */}
    <Wheel position={[1.1, 0.3, 3]} />
    <Wheel position={[-1.1, 0.3, 3]} />
    <Wheel position={[1.1, 0.3, -2]} />
    <Wheel position={[-1.1, 0.3, -2]} />
    <Wheel position={[1.1, 0.3, -3]} />
    <Wheel position={[-1.1, 0.3, -3]} />
    
    {/* Headlights */}
    <mesh position={[0.8, 0.5, 4.01]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[-0.8, 0.5, 4.01]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[1.35, 1.5, 3.5]}>
      <boxGeometry args={[0.2, 0.15, 0.15]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-1.35, 1.5, 3.5]}>
      <boxGeometry args={[0.2, 0.15, 0.15]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </group>
);

// Motorcycle model
export const MotorcycleModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Tank */}
    <mesh position={[0, 0.6, 0.2]} castShadow>
      <boxGeometry args={[0.5, 0.4, 0.8]} />
      <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Seat */}
    <mesh position={[0, 0.55, -0.5]} castShadow>
      <boxGeometry args={[0.4, 0.15, 0.8]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    
    {/* Frame */}
    <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.15, 0.1, 1.8]} />
      <meshStandardMaterial color="#374151" metalness={0.8} />
    </mesh>
    
    {/* Front fork */}
    <mesh position={[0, 0.5, 0.9]} rotation={[0.3, 0, 0]}>
      <boxGeometry args={[0.08, 0.6, 0.08]} />
      <meshStandardMaterial color="#6b7280" metalness={0.9} />
    </mesh>
    
    {/* Handlebars */}
    <mesh position={[0, 0.85, 0.7]}>
      <boxGeometry args={[0.8, 0.05, 0.05]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    
    {/* Grips */}
    <mesh position={[0.35, 0.85, 0.7]}>
      <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    <mesh position={[-0.35, 0.85, 0.7]}>
      <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    
    {/* Front wheel */}
    <mesh position={[0, 0.3, 1.1]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.3, 0.08, 8, 24]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.3, 1.1]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
      <meshStandardMaterial color="#6b7280" metalness={0.8} />
    </mesh>
    
    {/* Rear wheel */}
    <mesh position={[0, 0.3, -0.9]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.3, 0.1, 8, 24]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.3, -0.9]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.15, 0.15, 0.12, 12]} />
      <meshStandardMaterial color="#6b7280" metalness={0.8} />
    </mesh>
    
    {/* Headlight */}
    <mesh position={[0, 0.7, 1.15]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.8} />
    </mesh>
    
    {/* Tail light */}
    <mesh position={[0, 0.5, -1]}>
      <boxGeometry args={[0.15, 0.08, 0.05]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
    </mesh>
    
    {/* Mirrors */}
    <mesh position={[0.4, 0.9, 0.65]} rotation={[0, 0.3, 0]}>
      <boxGeometry args={[0.12, 0.06, 0.02]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-0.4, 0.9, 0.65]} rotation={[0, -0.3, 0]}>
      <boxGeometry args={[0.12, 0.06, 0.02]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    
    {/* Exhaust */}
    <mesh position={[0.25, 0.25, -0.5]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.05, 0.06, 0.6, 12]} />
      <meshStandardMaterial color="#6b7280" metalness={0.9} />
    </mesh>
  </group>
);

// Pickup truck model
export const PickupModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Cabin */}
    <mesh position={[0, 0.7, 1.2]} castShadow>
      <boxGeometry args={[1.9, 1, 1.8]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.5} />
    </mesh>
    
    {/* Cabin roof */}
    <mesh position={[0, 1.1, 1]} castShadow>
      <boxGeometry args={[1.8, 0.3, 1.4]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.5} />
    </mesh>
    
    {/* Front windshield */}
    <mesh position={[0, 0.95, 2.1]} rotation={[0.35, 0, 0]}>
      <boxGeometry args={[1.7, 0.02, 0.7]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.6} />
    </mesh>
    
    {/* Rear cabin window */}
    <mesh position={[0, 0.95, 0.09]}>
      <boxGeometry args={[1.6, 0.4, 0.02]} />
      <meshStandardMaterial color="#a0d8ef" transparent opacity={0.5} />
    </mesh>
    
    {/* Truck bed */}
    <mesh position={[0, 0.5, -1.3]} castShadow>
      <boxGeometry args={[1.9, 0.6, 2.4]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.5} />
    </mesh>
    
    {/* Bed interior */}
    <mesh position={[0, 0.55, -1.3]}>
      <boxGeometry args={[1.7, 0.5, 2.2]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    
    {/* Tailgate */}
    <mesh position={[0, 0.5, -2.51]}>
      <boxGeometry args={[1.9, 0.6, 0.05]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.5} />
    </mesh>
    
    {/* Wheels */}
    <Wheel position={[0.9, 0.25, 1.5]} />
    <Wheel position={[-0.9, 0.25, 1.5]} />
    <Wheel position={[0.9, 0.25, -1.8]} />
    <Wheel position={[-0.9, 0.25, -1.8]} />
    
    {/* Headlights */}
    <mesh position={[0.6, 0.5, 2.11]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[-0.6, 0.5, 2.11]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
    </mesh>
    
    {/* Tail lights */}
    <mesh position={[0.7, 0.5, -2.52]}>
      <boxGeometry args={[0.25, 0.15, 0.02]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
    </mesh>
    <mesh position={[-0.7, 0.5, -2.52]}>
      <boxGeometry args={[0.25, 0.15, 0.02]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[1, 1, 1.8]}>
      <boxGeometry args={[0.15, 0.1, 0.1]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-1, 1, 1.8]}>
      <boxGeometry args={[0.15, 0.1, 0.1]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </group>
);

// Vehicle model selector
export const getVehicleModel = (type: VehicleType, onPointerDown?: (event: any) => void) => {
  switch (type) {
    case 'caminhao':
      return <TruckModel onPointerDown={onPointerDown} />;
    case 'van':
      return <VanModel onPointerDown={onPointerDown} />;
    case 'furgao':
      return <FurgaoModel onPointerDown={onPointerDown} />;
    case 'onibus':
      return <BusModel onPointerDown={onPointerDown} />;
    case 'moto':
      return <MotorcycleModel onPointerDown={onPointerDown} />;
    case 'picape':
      return <PickupModel onPointerDown={onPointerDown} />;
    case 'carro_passeio':
    default:
      return <CarModel onPointerDown={onPointerDown} />;
  }
};

export const getVehicleLabel = (type: VehicleType): string => {
  switch (type) {
    case 'caminhao':
      return 'Caminhão';
    case 'van':
      return 'Van';
    case 'furgao':
      return 'Furgão';
    case 'onibus':
      return 'Ônibus';
    case 'moto':
      return 'Moto';
    case 'picape':
      return 'Picape';
    case 'carro_passeio':
    default:
      return 'Veículo';
  }
};