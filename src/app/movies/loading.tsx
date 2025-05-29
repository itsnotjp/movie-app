import Spinner from "@/components/Spinner";

export default function Loading() {
    return (
        <main className="pt-20 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Spinner />
                </div>
            </div>
        </main>
    );
}