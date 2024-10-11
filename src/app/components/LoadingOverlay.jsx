import styles from "../styles/LoadingOverlay.module.css";

const LoadingOverlay = ({ isLoading }) => {
  return (
    <div
      className={`${styles.loadingOverlay} ${isLoading ? styles.visible : ""}`}
    >
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};

export default LoadingOverlay;
