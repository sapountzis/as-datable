import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <section className="py-20 lg:py-28">
            <div className="section-container">
                <div className="max-w-xl mx-auto text-center">
                    <h1 className="font-display text-6xl md:text-8xl font-bold text-foreground mb-4">
                        404
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        This page doesn't exist.
                    </p>
                    <Link href="/" className="btn-primary group">
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>
                </div>
            </div>
        </section>
    );
}
