<template>
  <canvas ref="snowCanvas" class="snow-canvas" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const snowCanvas = ref(null);
let animationId = null;
let snowflakes = [];
let ctx = null;

// ✅ Control whether new snowflakes are created
const isSnowing = ref(true);
const allowNewSnow = ref(true);

// ✅ Stop creating new snow, let existing ones finish
const stopNewSnow = () => {
  allowNewSnow.value = false;
};

// ✅ Resume creating new snow
const startNewSnow = () => {
  allowNewSnow.value = true;
};

// ✅ Expose methods for parent component
defineExpose({
  stopNewSnow,
  startNewSnow,
  allowNewSnow,
  isSnowing,
});

class Snowflake {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
    this.swingSpeed = Math.random() * 0.02 + 0.01;
    this.swingDistance = Math.random() * 50 + 30;
    this.initialX = this.x;
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.rotation = Math.random() * Math.PI * 2;
    this.blur = Math.random() > 0.6;
    this.isActive = true; // ✅ Track if snowflake is active
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * -this.canvas.height - 100;
    const isMobile = this.canvas.width < 1023;
    this.radius = isMobile ? Math.random() * 3 + 1.5 : Math.random() * 5 + 3;
    this.speed = Math.random() * 2.5 + 1.5;
    this.opacity = Math.random() * 0.3 + 0.7;
    this.initialX = this.x;
    this.angle = Math.random() * Math.PI * 2;
    this.isActive = true;
  }

  update(allowNew) {
    this.angle += this.swingSpeed;
    this.x = this.initialX + Math.sin(this.angle) * this.swingDistance;
    this.y += this.speed;
    this.rotation += this.rotationSpeed;

    // ✅ When snowflake goes off screen
    if (this.y > this.canvas.height + 10) {
      if (allowNew) {
        // Reset and create new snowflake
        this.reset();
        this.initialX = Math.random() * this.canvas.width;
        this.x = this.initialX;
      } else {
        // Mark as inactive, don't create new
        this.isActive = false;
      }
    }

    if (this.x > this.canvas.width + 50) {
      this.initialX -= this.canvas.width + 100;
    } else if (this.x < -50) {
      this.initialX += this.canvas.width + 100;
    }
  }

  draw(ctx) {
    // ✅ Don't draw if inactive
    if (!this.isActive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.blur) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity})`;
    }

    this.drawSnowflakeShape(ctx);
    ctx.restore();
  }

  drawSnowflakeShape(ctx) {
    const arms = 6;
    const innerRadius = this.radius * 0.3;
    const outerRadius = this.radius;

    ctx.beginPath();

    for (let i = 0; i < arms * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / arms;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.95})`);
    gradient.addColorStop(1, `rgba(230, 240, 255, ${this.opacity * 0.85})`);

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

const initSnow = () => {
  const canvas = snowCanvas.value;
  if (!canvas) return;

  ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
  });

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const snowflakeCount = window.innerWidth < 1023 ? 25 : 60;
  snowflakes = Array.from(
    { length: snowflakeCount },
    () => new Snowflake(canvas)
  );

  let lastTime = performance.now();
  const targetFPS = 60;
  const frameTime = 1000 / targetFPS;

  const animate = (currentTime) => {
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
      lastTime = currentTime - (deltaTime % frameTime);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ✅ Check if any snowflakes are still active
      const hasActiveSnowflakes = snowflakes.some((s) => s.isActive);

      // ✅ Stop animation completely when all snowflakes are gone
      if (!hasActiveSnowflakes && !allowNewSnow.value) {
        isSnowing.value = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        return;
      }

      snowflakes.forEach((snowflake) => {
        snowflake.update(allowNewSnow.value);
        snowflake.draw(ctx);
      });
    }

    animationId = requestAnimationFrame(animate);
  };

  animate(performance.now());

  return () => {
    window.removeEventListener("resize", resizeCanvas);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};

onMounted(() => {
  const cleanup = initSnow();

  onUnmounted(() => {
    if (cleanup) cleanup();
  });
});
</script>

<style scoped>
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999999 !important;
  mix-blend-mode: screen;
  filter: brightness(1.1);
}
</style>
