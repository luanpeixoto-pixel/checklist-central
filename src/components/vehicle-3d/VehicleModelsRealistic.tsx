import { useRef } from 'react';
import { Group } from 'three';
import type { VehicleType } from '@/types/checklist';

interface VehicleModelProps {
  onPointerDown?: (event: any) => void;
}

// Realistic wheel component with more detail
const RealisticWheel = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => (
  <group position={position} scale={scale}>
    {/* Tire */}
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <torusGeometry args={[0.22, 0.08, 16, 32]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    {/* Rim */}
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.14, 0.14, 0.12, 24]} />
      <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Hub cap detail */}
    <mesh rotation={[0, 0, Math.PI / 2]} position={[0.07, 0, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
      <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

// Realistic Car/Sedan model with curved body
export const RealisticCarModel = ({ onPointerDown }: VehicleModelProps) => {
  const groupRef = useRef<Group>(null);
  
  return (
    <group ref={groupRef} onPointerDown={onPointerDown}>
      {/* Lower body - curved base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.35, 3.2, 8, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Main body shell */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.6, 2.8, 8, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Cabin - rounded top */}
      <mesh position={[0, 0.75, -0.2]} castShadow>
        <sphereGeometry args={[0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 0.95, -0.3]} castShadow>
        <capsuleGeometry args={[0.55, 1.2, 8, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Front hood curve */}
      <mesh position={[0, 0.5, 1.4]} rotation={[0.2, 0, 0]} castShadow>
        <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Rear trunk curve */}
      <mesh position={[0, 0.5, -1.5]} rotation={[-0.3, 0, 0]} castShadow>
        <sphereGeometry args={[0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.9, 0.7]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.3, 0.7]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} metalness={0.9} roughness={0.1} side={2} />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 0.85, -1.15]} rotation={[-0.6, 0, 0]}>
        <planeGeometry args={[1.2, 0.55]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} metalness={0.9} roughness={0.1} side={2} />
      </mesh>
      
      {/* Side windows left */}
      <mesh position={[0.72, 0.85, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.4]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
      </mesh>
      
      {/* Side windows right */}
      <mesh position={[-0.72, 0.85, -0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.4]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
      </mesh>
      
      {/* Wheels */}
      <RealisticWheel position={[0.7, 0.22, 1.2]} />
      <RealisticWheel position={[-0.7, 0.22, 1.2]} />
      <RealisticWheel position={[0.7, 0.22, -1.2]} />
      <RealisticWheel position={[-0.7, 0.22, -1.2]} />
      
      {/* Headlights */}
      <mesh position={[0.45, 0.45, 1.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.45, 0.45, 1.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
      </mesh>
      
      {/* Tail lights */}
      <mesh position={[0.5, 0.45, -1.9]}>
        <capsuleGeometry args={[0.06, 0.15, 4, 8]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.5, 0.45, -1.9]}>
        <capsuleGeometry args={[0.06, 0.15, 4, 8]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
      </mesh>
      
      {/* Side mirrors */}
      <mesh position={[0.8, 0.85, 0.55]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} />
      </mesh>
      <mesh position={[-0.8, 0.85, 0.55]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} />
      </mesh>
      
      {/* Front grille */}
      <mesh position={[0, 0.35, 1.9]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
      </mesh>
    </group>
  );
};

// Realistic Truck model
export const RealisticTruckModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Cabin base */}
    <mesh position={[0, 0.6, 2]} castShadow>
      <capsuleGeometry args={[0.8, 0.8, 8, 16]} />
      <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Cabin top - rounded */}
    <mesh position={[0, 1.1, 2]} castShadow>
      <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Cabin front curve */}
    <mesh position={[0, 0.7, 2.7]} rotation={[0.3, 0, 0]} castShadow>
      <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Cabin windshield */}
    <mesh position={[0, 1.15, 2.65]} rotation={[0.35, 0, 0]}>
      <planeGeometry args={[1.6, 0.7]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} side={2} />
    </mesh>
    
    {/* Cargo container - rounded edges */}
    <mesh position={[0, 1, -1]} castShadow>
      <capsuleGeometry args={[0.9, 4, 8, 16]} />
      <meshStandardMaterial color="#6b7280" metalness={0.4} roughness={0.6} />
    </mesh>
    
    {/* Cargo top */}
    <mesh position={[0, 1.6, -1]} castShadow>
      <boxGeometry args={[2, 0.4, 4.2]} />
      <meshStandardMaterial color="#6b7280" metalness={0.4} roughness={0.6} />
    </mesh>
    
    {/* Front wheels */}
    <RealisticWheel position={[0.9, 0.28, 2]} scale={1.1} />
    <RealisticWheel position={[-0.9, 0.28, 2]} scale={1.1} />
    
    {/* Rear wheels (dual) */}
    <RealisticWheel position={[0.9, 0.28, -1.8]} scale={1.1} />
    <RealisticWheel position={[-0.9, 0.28, -1.8]} scale={1.1} />
    <RealisticWheel position={[0.9, 0.28, -0.8]} scale={1.1} />
    <RealisticWheel position={[-0.9, 0.28, -0.8]} scale={1.1} />
    
    {/* Headlights */}
    <mesh position={[0.55, 0.55, 2.95]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    <mesh position={[-0.55, 0.55, 2.95]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[1.05, 1.2, 2.4]}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-1.05, 1.2, 2.4]}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </group>
);

// Realistic Van model
export const RealisticVanModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Main body - rounded capsule shape */}
    <mesh position={[0, 0.75, 0]} castShadow>
      <capsuleGeometry args={[0.75, 3.5, 8, 16]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Roof curve */}
    <mesh position={[0, 1.35, 0]} castShadow>
      <capsuleGeometry args={[0.65, 3.2, 8, 16]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Front hood - curved */}
    <mesh position={[0, 0.6, 2]} rotation={[0.2, 0, 0]} castShadow>
      <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Front windshield */}
    <mesh position={[0, 1.15, 2.15]} rotation={[0.4, 0, 0]}>
      <planeGeometry args={[1.5, 0.8]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} side={2} />
    </mesh>
    
    {/* Side windows */}
    <mesh position={[0.83, 1.05, 1.2]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
    </mesh>
    <mesh position={[-0.83, 1.05, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
    </mesh>
    
    {/* Rear windows */}
    <mesh position={[0.35, 1.05, -2.1]}>
      <planeGeometry args={[0.4, 0.45]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
    </mesh>
    <mesh position={[-0.35, 1.05, -2.1]}>
      <planeGeometry args={[0.4, 0.45]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
    </mesh>
    
    {/* Wheels */}
    <RealisticWheel position={[0.8, 0.22, 1.4]} />
    <RealisticWheel position={[-0.8, 0.22, 1.4]} />
    <RealisticWheel position={[0.8, 0.22, -1.4]} />
    <RealisticWheel position={[-0.8, 0.22, -1.4]} />
    
    {/* Headlights */}
    <mesh position={[0.5, 0.55, 2.35]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    <mesh position={[-0.5, 0.55, 2.35]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[0.95, 1.15, 1.85]}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-0.95, 1.15, 1.85]}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </group>
);

// Realistic Furgao (cargo van) model
export const RealisticFurgaoModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Cabin - rounded */}
    <mesh position={[0, 0.65, 1.8]} castShadow>
      <capsuleGeometry args={[0.6, 1, 8, 16]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Cabin top */}
    <mesh position={[0, 1.1, 1.8]} castShadow>
      <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Cargo box - rounded edges */}
    <mesh position={[0, 0.95, -0.7]} castShadow>
      <capsuleGeometry args={[0.85, 3, 8, 16]} />
      <meshStandardMaterial color="#e5e7eb" metalness={0.3} roughness={0.7} />
    </mesh>
    
    {/* Cargo roof */}
    <mesh position={[0, 1.65, -0.7]} castShadow>
      <capsuleGeometry args={[0.75, 2.8, 8, 16]} />
      <meshStandardMaterial color="#e5e7eb" metalness={0.3} roughness={0.7} />
    </mesh>
    
    {/* Windshield */}
    <mesh position={[0, 1.05, 2.45]} rotation={[0.3, 0, 0]}>
      <planeGeometry args={[1.4, 0.65]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} side={2} />
    </mesh>
    
    {/* Rear doors */}
    <mesh position={[0, 0.95, -2.35]}>
      <capsuleGeometry args={[0.6, 0.8, 4, 8]} />
      <meshStandardMaterial color="#d1d5db" metalness={0.4} roughness={0.6} />
    </mesh>
    
    {/* Wheels */}
    <RealisticWheel position={[0.8, 0.22, 1.5]} />
    <RealisticWheel position={[-0.8, 0.22, 1.5]} />
    <RealisticWheel position={[0.8, 0.22, -1.6]} />
    <RealisticWheel position={[-0.8, 0.22, -1.6]} />
    
    {/* Headlights */}
    <mesh position={[0.5, 0.5, 2.45]}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    <mesh position={[-0.5, 0.5, 2.45]}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
  </group>
);

// Realistic Bus model
export const RealisticBusModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Main body - elongated capsule */}
    <mesh position={[0, 0.9, 0]} castShadow>
      <capsuleGeometry args={[0.95, 7, 8, 16]} />
      <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Roof */}
    <mesh position={[0, 1.7, 0]} castShadow>
      <capsuleGeometry args={[0.85, 6.8, 8, 16]} />
      <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Front section - curved */}
    <mesh position={[0, 1, 3.8]} rotation={[0.1, 0, 0]} castShadow>
      <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.4} />
    </mesh>
    
    {/* Front windshield */}
    <mesh position={[0, 1.4, 3.95]} rotation={[0.15, 0, 0]}>
      <planeGeometry args={[2, 0.9]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} side={2} />
    </mesh>
    
    {/* Side windows - row */}
    {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((z, i) => (
      <group key={i}>
        <mesh position={[1.05, 1.2, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.7, 0.55]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
        </mesh>
        <mesh position={[-1.05, 1.2, z]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.7, 0.55]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
        </mesh>
      </group>
    ))}
    
    {/* Door */}
    <mesh position={[1.06, 0.85, 3]}>
      <capsuleGeometry args={[0.35, 0.6, 4, 8]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    
    {/* Rear window */}
    <mesh position={[0, 1.35, -3.95]}>
      <planeGeometry args={[1.6, 0.7]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
    </mesh>
    
    {/* Wheels */}
    <RealisticWheel position={[1, 0.28, 3]} scale={1.1} />
    <RealisticWheel position={[-1, 0.28, 3]} scale={1.1} />
    <RealisticWheel position={[1, 0.28, -2]} scale={1.1} />
    <RealisticWheel position={[-1, 0.28, -2]} scale={1.1} />
    <RealisticWheel position={[1, 0.28, -3]} scale={1.1} />
    <RealisticWheel position={[-1, 0.28, -3]} scale={1.1} />
    
    {/* Headlights */}
    <mesh position={[0.7, 0.6, 4]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    <mesh position={[-0.7, 0.6, 4]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[1.2, 1.5, 3.6]}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-1.2, 1.5, 3.6]}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </group>
);

// Realistic Motorcycle model
export const RealisticMotorcycleModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Fuel tank - teardrop shape */}
    <mesh position={[0, 0.6, 0.15]} castShadow>
      <sphereGeometry args={[0.28, 32, 16]} />
      <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.58, 0.45]} castShadow>
      <sphereGeometry args={[0.22, 32, 16]} />
      <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
    </mesh>
    
    {/* Seat - curved */}
    <mesh position={[0, 0.52, -0.45]} castShadow>
      <capsuleGeometry args={[0.15, 0.7, 8, 16]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    
    {/* Frame - curved tubes */}
    <mesh position={[0, 0.38, 0]} rotation={[0.1, 0, 0]}>
      <capsuleGeometry args={[0.04, 1.6, 8, 8]} />
      <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
    </mesh>
    
    {/* Front fork */}
    <mesh position={[0, 0.5, 0.85]} rotation={[0.35, 0, 0]}>
      <capsuleGeometry args={[0.025, 0.5, 8, 8]} />
      <meshStandardMaterial color="#a0a0a0" metalness={0.95} roughness={0.1} />
    </mesh>
    
    {/* Handlebars */}
    <mesh position={[0, 0.82, 0.7]} rotation={[0, 0, Math.PI / 2]}>
      <capsuleGeometry args={[0.02, 0.7, 8, 8]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
    </mesh>
    
    {/* Front wheel */}
    <mesh position={[0, 0.3, 1.05]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.28, 0.06, 16, 32]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.3, 1.05]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
      <meshStandardMaterial color="#808080" metalness={0.9} />
    </mesh>
    
    {/* Rear wheel */}
    <mesh position={[0, 0.28, -0.85]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.26, 0.08, 16, 32]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.28, -0.85]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
      <meshStandardMaterial color="#808080" metalness={0.9} />
    </mesh>
    
    {/* Engine block */}
    <mesh position={[0, 0.32, 0]}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
    </mesh>
    
    {/* Exhaust - curved pipe */}
    <mesh position={[0.18, 0.22, -0.4]} rotation={[0, 0, 0.1]}>
      <capsuleGeometry args={[0.035, 0.6, 8, 8]} />
      <meshStandardMaterial color="#808080" metalness={0.95} roughness={0.1} />
    </mesh>
    
    {/* Headlight */}
    <mesh position={[0, 0.68, 1.1]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.8} />
    </mesh>
    
    {/* Tail light */}
    <mesh position={[0, 0.48, -0.95]}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} />
    </mesh>
    
    {/* Mirrors */}
    <mesh position={[0.38, 0.88, 0.65]} rotation={[0, 0.4, 0]}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-0.38, 0.88, 0.65]} rotation={[0, -0.4, 0]}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    
    {/* Windshield */}
    <mesh position={[0, 0.78, 0.9]} rotation={[0.6, 0, 0]}>
      <planeGeometry args={[0.35, 0.25]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} side={2} />
    </mesh>
  </group>
);

// Realistic Pickup truck model
export const RealisticPickupModel = ({ onPointerDown }: VehicleModelProps) => (
  <group onPointerDown={onPointerDown}>
    {/* Cabin - rounded */}
    <mesh position={[0, 0.65, 1.2]} castShadow>
      <capsuleGeometry args={[0.7, 1.4, 8, 16]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Cabin roof - curved */}
    <mesh position={[0, 1.15, 1]} castShadow>
      <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Front hood */}
    <mesh position={[0, 0.55, 2]} rotation={[0.15, 0, 0]} castShadow>
      <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Front windshield */}
    <mesh position={[0, 1, 1.95]} rotation={[0.45, 0, 0]}>
      <planeGeometry args={[1.5, 0.65]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} side={2} />
    </mesh>
    
    {/* Rear cabin window */}
    <mesh position={[0, 0.95, 0.15]}>
      <planeGeometry args={[1.4, 0.4]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} side={2} />
    </mesh>
    
    {/* Truck bed - open top */}
    <mesh position={[0, 0.45, -1.25]} castShadow>
      <capsuleGeometry args={[0.65, 2.1, 8, 16]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Bed walls */}
    <mesh position={[0.8, 0.6, -1.25]}>
      <boxGeometry args={[0.08, 0.5, 2.2]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
    </mesh>
    <mesh position={[-0.8, 0.6, -1.25]}>
      <boxGeometry args={[0.08, 0.5, 2.2]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Tailgate */}
    <mesh position={[0, 0.55, -2.4]}>
      <capsuleGeometry args={[0.25, 1.2, 4, 8]} />
      <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
    </mesh>
    
    {/* Bed floor - inner */}
    <mesh position={[0, 0.35, -1.25]}>
      <boxGeometry args={[1.5, 0.05, 2.1]} />
      <meshStandardMaterial color="#374151" roughness={0.8} />
    </mesh>
    
    {/* Wheels */}
    <RealisticWheel position={[0.8, 0.25, 1.5]} scale={1.05} />
    <RealisticWheel position={[-0.8, 0.25, 1.5]} scale={1.05} />
    <RealisticWheel position={[0.8, 0.25, -1.7]} scale={1.05} />
    <RealisticWheel position={[-0.8, 0.25, -1.7]} scale={1.05} />
    
    {/* Headlights */}
    <mesh position={[0.55, 0.5, 2.4]}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    <mesh position={[-0.55, 0.5, 2.4]}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#fffacd" emissiveIntensity={0.6} />
    </mesh>
    
    {/* Tail lights */}
    <mesh position={[0.65, 0.5, -2.45]}>
      <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
      <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
    </mesh>
    <mesh position={[-0.65, 0.5, -2.45]}>
      <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
      <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
    </mesh>
    
    {/* Side mirrors */}
    <mesh position={[0.9, 1, 1.8]}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    <mesh position={[-0.9, 1, 1.8]}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
    
    {/* Front grille */}
    <mesh position={[0, 0.4, 2.45]}>
      <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.9} />
    </mesh>
  </group>
);

// Vehicle model selector for realistic models
export const getRealisticVehicleModel = (type: VehicleType, onPointerDown?: (event: any) => void) => {
  switch (type) {
    case 'caminhao':
      return <RealisticTruckModel onPointerDown={onPointerDown} />;
    case 'van':
      return <RealisticVanModel onPointerDown={onPointerDown} />;
    case 'furgao':
      return <RealisticFurgaoModel onPointerDown={onPointerDown} />;
    case 'onibus':
      return <RealisticBusModel onPointerDown={onPointerDown} />;
    case 'moto':
      return <RealisticMotorcycleModel onPointerDown={onPointerDown} />;
    case 'picape':
      return <RealisticPickupModel onPointerDown={onPointerDown} />;
    case 'carro_passeio':
    default:
      return <RealisticCarModel onPointerDown={onPointerDown} />;
  }
};
