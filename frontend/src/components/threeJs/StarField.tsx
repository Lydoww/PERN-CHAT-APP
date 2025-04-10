import { useEffect, useRef } from "react";
import * as THREE from "three";

const StarField = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialisation
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    // Étoiles fixes (10000)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Système d'étoiles filantes amélioré
    class ShootingStar {
      mesh: THREE.Line;
      velocity: THREE.Vector3;
      lifespan: number;

      constructor() {
        // Point de départ aléatoire sur les bords de l'écran
        const startPosition = new THREE.Vector3(
          (Math.random() > 0.5 ? 1 : -1) * 1000,
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500
        );

        // Direction vers le centre avec une variation aléatoire
        this.velocity = new THREE.Vector3(
          -startPosition.x * 0.01 * Math.random(),
          -startPosition.y * 0.01 * Math.random(),
          -startPosition.z * 0.01 * Math.random()
        ).multiplyScalar(2 + Math.random() * 3);

        // Création de la traînée
        const points = [];
        const tailLength = 50;

        for (let i = 0; i < tailLength; i++) {
          points.push(startPosition.clone());
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
          linewidth: 1,
        });

        this.mesh = new THREE.Line(geometry, material);
        this.lifespan = 100 + Math.random() * 50;
        scene.add(this.mesh);
      }

      update() {
        // Mise à jour de la position
        const positions = this.mesh.geometry.attributes.position
          .array as Float32Array;

        // Décalage des positions existantes (effet de traînée)
        for (let i = positions.length - 3; i >= 3; i -= 3) {
          positions[i] = positions[i - 3];
          positions[i + 1] = positions[i - 2];
          positions[i + 2] = positions[i - 1];
        }

        // Nouvelle position de la tête
        const headPosition = new THREE.Vector3(
          positions[0] + this.velocity.x,
          positions[1] + this.velocity.y,
          positions[2] + this.velocity.z
        );

        positions[0] = headPosition.x;
        positions[1] = headPosition.y;
        positions[2] = headPosition.z;

        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.lifespan--;

        // Réduire l'opacité progressivement
        (this.mesh.material as THREE.LineBasicMaterial).opacity =
          this.lifespan / 150;
      }

      dispose() {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
      }
    }

    const shootingStars: ShootingStar[] = [];

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotation lente du champ d'étoiles
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;

      // Gestion des étoiles filantes
      if (Math.random() < 0.005 && shootingStars.length < 3) {
        shootingStars.push(new ShootingStar());
      }

      shootingStars.forEach((star, index) => {
        star.update();
        if (star.lifespan <= 0) {
          star.dispose();
          shootingStars.splice(index, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      shootingStars.forEach((star) => star.dispose());
    };
  }, []);

  return (
    <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10" />
  );
};

export default StarField;
