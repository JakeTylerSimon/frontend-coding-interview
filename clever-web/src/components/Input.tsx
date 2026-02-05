import styles from "./Input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  const classes = [styles.input, className].filter(Boolean).join(" ");
  return (
    <div className={styles.wrap}>
      <input className={classes} {...props} />
    </div>
  );
}
