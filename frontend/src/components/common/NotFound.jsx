import { Link } from "react-router";
import { CgSpinnerTwoAlt as Spinner } from "react-icons/cg";
import { Helmet } from "react-helmet";

const NotFound = () => {
    return (
        <main className="absolute top-0 left-0 flex flex-col items-center justify-center h-screen w-screen bg-zinc-900 text-zinc-200 gap-4 p-3 z-50">
            <Helmet>
                <title>404 Not Found</title>
            </Helmet>
            
            <h1 className="text-3xl md:text-4xl font-bold">404 Not Found</h1>
            <p className="text-md md:text-lg">The page you are looking for does not exist.</p>
            <Link to="/" className="mt-4 flex items-center space-x-2 text-zinc-100 hover:text-zinc-200 hover:underline">
                <Spinner className="animate-spin" />
                <span>Go back to home</span>
            </Link> 
        </main>
    );
}

export default NotFound;