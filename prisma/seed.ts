import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const hashedPassword = await bcrypt.hash("demo1234", 12);

  const alice = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@demo.com",
      hashedPassword,
      role: "admin",
      image: null,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@demo.com",
      hashedPassword,
      role: "member",
      image: null,
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: "Carol Davis",
      email: "carol@demo.com",
      hashedPassword,
      role: "member",
      image: null,
    },
  });

  // Create projects
  const webApp = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description:
        "Complete overhaul of the company website with modern design, improved UX, and mobile-first approach.",
      status: "active",
      priority: "high",
      color: "#6366f1",
      ownerId: alice.id,
    },
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: "Mobile App v2.0",
      description:
        "Major update to the mobile application including new features, performance improvements, and redesigned navigation.",
      status: "active",
      priority: "high",
      color: "#ec4899",
      ownerId: alice.id,
    },
  });

  const apiProject = await prisma.project.create({
    data: {
      name: "API Integration Hub",
      description:
        "Build a centralized API gateway for managing third-party integrations and internal microservices.",
      status: "active",
      priority: "medium",
      color: "#10b981",
      ownerId: bob.id,
    },
  });

  const marketingProject = await prisma.project.create({
    data: {
      name: "Q4 Marketing Campaign",
      description:
        "Plan and execute the Q4 marketing campaign including social media, email outreach, and content creation.",
      status: "active",
      priority: "medium",
      color: "#f59e0b",
      ownerId: carol.id,
    },
  });

  const archivedProject = await prisma.project.create({
    data: {
      name: "Legacy System Migration",
      description:
        "Migrate legacy PHP system to modern Node.js stack. Project completed successfully.",
      status: "completed",
      priority: "low",
      color: "#6b7280",
      ownerId: alice.id,
    },
  });

  // Website Redesign tasks
  const webTasks = [
    { title: "Design new homepage mockup", status: "done", priority: "high", assigneeId: carol.id, order: 0 },
    { title: "Implement responsive navigation", status: "done", priority: "high", assigneeId: bob.id, order: 1 },
    { title: "Build hero section component", status: "in-progress", priority: "high", assigneeId: carol.id, order: 0 },
    { title: "Create pricing page layout", status: "in-progress", priority: "medium", assigneeId: alice.id, order: 1 },
    { title: "Integrate contact form with API", status: "in-progress", priority: "medium", assigneeId: bob.id, order: 2 },
    { title: "Add dark mode support", status: "todo", priority: "low", assigneeId: null, order: 0 },
    { title: "Optimize images and assets", status: "todo", priority: "medium", assigneeId: carol.id, order: 1 },
    { title: "Write unit tests for components", status: "todo", priority: "high", assigneeId: bob.id, order: 2 },
    { title: "Set up CI/CD pipeline", status: "todo", priority: "medium", assigneeId: alice.id, order: 3 },
    { title: "Performance audit and optimization", status: "todo", priority: "high", assigneeId: null, order: 4 },
  ];

  for (const task of webTasks) {
    await prisma.task.create({
      data: { ...task, projectId: webApp.id },
    });
  }

  // Mobile App tasks
  const mobileTasks = [
    { title: "Redesign onboarding flow", status: "done", priority: "high", assigneeId: alice.id, order: 0 },
    { title: "Implement push notifications", status: "in-progress", priority: "high", assigneeId: bob.id, order: 0 },
    { title: "Add offline mode support", status: "in-progress", priority: "medium", assigneeId: carol.id, order: 1 },
    { title: "Build new dashboard widgets", status: "todo", priority: "medium", assigneeId: alice.id, order: 0 },
    { title: "Integrate biometric authentication", status: "todo", priority: "high", assigneeId: null, order: 1 },
    { title: "Update app store screenshots", status: "todo", priority: "low", assigneeId: carol.id, order: 2 },
  ];

  for (const task of mobileTasks) {
    await prisma.task.create({
      data: { ...task, projectId: mobileApp.id },
    });
  }

  // API Integration tasks
  const apiTasks = [
    { title: "Design API gateway architecture", status: "done", priority: "high", assigneeId: bob.id, order: 0 },
    { title: "Set up authentication middleware", status: "done", priority: "high", assigneeId: bob.id, order: 1 },
    { title: "Implement rate limiting", status: "in-progress", priority: "medium", assigneeId: alice.id, order: 0 },
    { title: "Create Stripe integration", status: "todo", priority: "high", assigneeId: bob.id, order: 0 },
    { title: "Add webhook management", status: "todo", priority: "medium", assigneeId: null, order: 1 },
    { title: "Write API documentation", status: "todo", priority: "medium", assigneeId: carol.id, order: 2 },
  ];

  for (const task of apiTasks) {
    await prisma.task.create({
      data: { ...task, projectId: apiProject.id },
    });
  }

  // Marketing Campaign tasks
  const marketingTasks = [
    { title: "Define campaign objectives and KPIs", status: "done", priority: "high", assigneeId: carol.id, order: 0 },
    { title: "Create social media content calendar", status: "in-progress", priority: "high", assigneeId: carol.id, order: 0 },
    { title: "Design email newsletter templates", status: "in-progress", priority: "medium", assigneeId: alice.id, order: 1 },
    { title: "Write blog post series", status: "todo", priority: "medium", assigneeId: carol.id, order: 0 },
    { title: "Set up analytics tracking", status: "todo", priority: "high", assigneeId: bob.id, order: 1 },
  ];

  for (const task of marketingTasks) {
    await prisma.task.create({
      data: { ...task, projectId: marketingProject.id },
    });
  }

  // Add some comments
  const webTasksDone = await prisma.task.findMany({
    where: { projectId: webApp.id, status: "done" },
  });

  if (webTasksDone.length > 0) {
    await prisma.comment.create({
      data: {
        content: "Looks great! The new design really improves the user experience.",
        taskId: webTasksDone[0].id,
        authorId: alice.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: "I tested on mobile and everything renders perfectly. Nice work!",
        taskId: webTasksDone[0].id,
        authorId: bob.id,
      },
    });
  }

  console.log("Database seeded successfully!");
  console.log(`Created ${3} users, ${5} projects, and ${27} tasks`);
  console.log("\nDemo credentials:");
  console.log("  Email: alice@demo.com");
  console.log("  Password: demo1234");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
