import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Utensils, Users, Building, ChevronRight, Star } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function LandingPage() {
  const stats = [
    { label: "Meals Donated", value: "50,000+", icon: Utensils, color: "text-[#E89951]", bg: "bg-[#E89951]/10" },
    { label: "Active Donors", value: "1,200+", icon: Users, color: "text-[#A5CF83]", bg: "bg-[#A5CF83]/10" },
    { label: "NGOs Connected", value: "350+", icon: Building, color: "text-[#ECB65F]", bg: "bg-[#ECB65F]/10" },
  ];

  const steps = [
    {
      title: "List Excess Food",
      description: "Restaurants, hotels, or individuals can easily list their excess, perfectly good food on our platform.",
      icon: "1",
    },
    {
      title: "NGOs Request Pickup",
      description: "Verified NGOs and receivers get notified and can request to pick up the listed food.",
      icon: "2",
    },
    {
      title: "Feed the Community",
      description: "Food is safely picked up and distributed to those who need it most, reducing waste.",
      icon: "3",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32 lg:pt-24 lg:pb-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#E89951] opacity-20 blur-[100px]"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center rounded-full border border-[#E89951]/30 bg-[#E89951]/10 px-3 py-1 text-sm font-medium text-[#E89951] mb-6">
                <span className="flex h-2 w-2 rounded-full bg-[#E89951] mr-2"></span>
                Join the movement against food waste
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                Share Food, <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E89951] to-[#ECB65F]">
                  Spread Hope
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Connect your surplus food with local NGOs and communities in need. Every meal shared is a step towards a zero-waste, hunger-free world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Become a Donor <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/donations">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Find Donations
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative lg:ml-auto"
            >
              <div className="relative rounded-2xl bg-gradient-to-tr from-[#E89951]/20 to-[#A5CF83]/20 p-2 shadow-2xl shadow-[#E89951]/10">
                <img
                  src="https://images.unsplash.com/photo-1593113563332-ce147ee37358?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Volunteers organizing food donations"
                  className="rounded-xl object-cover h-[400px] w-full"
                />

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
                >
                  <div className="bg-[#A5CF83]/20 p-3 rounded-full">
                    <Utensils className="h-6 w-6 text-[#A5CF83]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Just donated</p>
                    <p className="font-bold text-gray-900">50 Meals by Fresh Bakery</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works*/}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How FoodShare Works</h2>
            <p className="text-lg text-gray-600">A simple, effective process to bridge the gap between excess food and those who need it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#E89951]/20 via-[#E89951] to-[#E89951]/20" />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-gray-50 flex items-center justify-center text-3xl font-bold text-[#E89951] mb-6 relative">
                  {step.icon}
                  {idx < steps.length - 1 && (
                    <ChevronRight className="md:hidden absolute -bottom-8 h-6 w-6 text-gray-300" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-[#A5CF83] opacity-10 blur-[100px]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#E89951] rounded-3xl p-8 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make a difference?</h2>
              <p className="text-[#FFE8D6] text-lg mb-10">
                Whether you have surplus food to donate or represent an organization helping the hungry, join our community today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth/register">
                  <Button size="lg" className="bg-white text-[#E89951] hover:bg-gray-50 w-full sm:w-auto">
                    Register as Donor
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#E89951] w-full sm:w-auto">
                    Register as NGO
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
