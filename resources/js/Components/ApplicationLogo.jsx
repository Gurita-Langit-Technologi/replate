export default function ApplicationLogo({ className }) {
    return (
        <img
            src="/image/logo(2).png"
            alt="Replate"
            onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/image/logo.png';
            }}
            className={className || "h-12 w-auto"}
        />
    );
}