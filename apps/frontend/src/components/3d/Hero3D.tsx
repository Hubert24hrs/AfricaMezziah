"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, MeshDistortMaterial } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function FloatingSphere({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.8}
                    distort={0.3}
                    speed={2}
                />
            </mesh>
        </Float>
    );
}

function FloatingTorus({ position, color }: { position: [number, number, number]; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8}>
            <mesh ref={meshRef} position={position}>
                <torusGeometry args={[1, 0.4, 32, 64]} />
                <MeshDistortMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.9}
                    distort={0.2}
                    speed={1.5}
                />
            </mesh>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff8b10" />

            {/* Main floating elements */}
            <FloatingSphere position={[-3, 0.5, 0]} color="#c7714e" scale={1.2} />
            <FloatingSphere position={[3.5, -0.5, -1]} color="#ff8b10" scale={0.8} />
            <FloatingSphere position={[1, 2, -2]} color="#ffc770" scale={0.5} />
            <FloatingSphere position={[-2, -2, -1]} color="#db9276" scale={0.6} />

            <FloatingTorus position={[2, 1, -1.5]} color="#c7714e" />
            <FloatingTorus position={[-4, -1, -2]} color="#ff8b10" />

            <Environment preset="city" />
        </>
    );
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
