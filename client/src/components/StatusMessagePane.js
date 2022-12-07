function StatusMessagePane({ message }) {
  return (
    <div className="SecondaryPane">
      <p className="StatusMessageText">{message}</p>
    </div>
  );
}

export { StatusMessagePane };