import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ArticleCard from "./ArticleCard";

type Article = {
  id: number;
  name: string;
  room: string;
  country: "AT" | "XK";
  total_price: number;
  priority: string;
  status: "offen" | "gekauft";
  image_url: string | null;
};

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setArticles(data || []);
  }

  return (
    <div className="mt-4 space-y-3 pb-28">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={{
            name: article.name,
            room: article.room,
            country: article.country,
            price: article.total_price,
            priority: Number(article.priority.replace("P", "")) as
              | 0
              | 1
              | 2
              | 3,
            status: article.status,
            image:
              article.image_url ||
              "https://picsum.photos/300",
          }}
        />
      ))}
    </div>
  );
}