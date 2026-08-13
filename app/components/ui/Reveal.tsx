"use client";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";

const variants: Record<"up" | "left" | "right", Variants> = {
  up: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
};

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  direction?: "up" | "left" | "right";
};

export const Reveal = ({
  delay = 0,
  direction = "up",
  children,
  ...props
}: RevealProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants[direction]}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
