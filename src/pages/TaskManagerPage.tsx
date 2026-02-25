import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TaskManager from "@/features/task-manager/components/TaskManager";

const TaskManagerPage = () => (
  <div className="min-h-screen marble-bg text-foreground">
    <Header />
    <TaskManager />
    <Footer />
  </div>
);

export default TaskManagerPage;
