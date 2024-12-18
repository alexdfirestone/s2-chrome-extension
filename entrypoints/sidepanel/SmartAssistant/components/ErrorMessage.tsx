interface ErrorMessageProps {
    message: string;
  }
  
  export const ErrorMessage = ({ message }: ErrorMessageProps) => (
    <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
      {message}
    </div>
  );