import { useEffect, useRef } from "react";
import * as THREE from "three";

const StarField = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("✨ StarField mounted");

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
      alpha: false, // on désactive alpha pour s'assurer que le fond est visible
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000010); // force un fond sombre
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 🔍 Test visuel : bordure verte autour du canvas

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    mountRef.current?.appendChild(renderer.domElement);

    // === ÉTOILES FIXES ===
    const starsCount = 6000;
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 2000;
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    class ShootingStar {
      mesh: THREE.Line;
      velocity: THREE.Vector3;
      lifespan: number;
      positions: Float32Array;

      constructor() {
        const startPosition = new THREE.Vector3(
          (Math.random() > 0.5 ? 1 : -1) * 1000,
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500
        );

        this.velocity = new THREE.Vector3(
          -startPosition.x * 0.01,
          -startPosition.y * 0.01,
          -startPosition.z * 0.01
        ).multiplyScalar(3);

        const tailLength = 30;
        this.positions = new Float32Array(tailLength * 3);

        for (let i = 0; i < tailLength; i++) {
          this.positions[i * 3] = startPosition.x;
          this.positions[i * 3 + 1] = startPosition.y;
          this.positions[i * 3 + 2] = startPosition.z;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(this.positions, 3)
        );

        const material = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
          linewidth: 1,
        });

        this.mesh = new THREE.Line(geometry, material);
        this.lifespan = 80;
        scene.add(this.mesh);
      }

      update() {
        const positions = this.positions;
        for (let i = positions.length - 1; i >= 3; i--) {
          positions[i] = positions[i - 3];
        }

        positions[0] += this.velocity.x;
        positions[1] += this.velocity.y;
        positions[2] += this.velocity.z;

        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.lifespan--;

        (this.mesh.material as THREE.LineBasicMaterial).opacity =
          this.lifespan / 80;
      }

      dispose() {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
      }
    }

    const shootingStars: ShootingStar[] = [];
    let lastStarTime = 0;
    const starInterval = 2000;

    let then = performance.now();
    const fpsInterval = 1000 / 60;

    const animate = (now: number) => {
      requestAnimationFrame(animate);
      const elapsed = now - then;
      if (elapsed < fpsInterval) return;
      then = now - (elapsed % fpsInterval);

      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;

      const currentTime = performance.now();
      if (
        currentTime - lastStarTime > starInterval &&
        shootingStars.length < 2
      ) {
        shootingStars.push(new ShootingStar());
        lastStarTime = currentTime;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        shootingStars[i].update();
        if (shootingStars[i].lifespan <= 0) {
          shootingStars[i].dispose();
          shootingStars.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.remove(stars);
      starsGeometry.dispose();
      starsMaterial.dispose();
      shootingStars.forEach((star) => star.dispose());
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0" />;
};

export default StarField;
