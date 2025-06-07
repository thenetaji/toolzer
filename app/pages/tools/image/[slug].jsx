import ToolContainer from "@/components/ToolContainer";
import ToolContent from "@/components/ToolContent";
import SimilarTools from "@/components/SimilarTools";
import ImageTool from "@/components/tools/image";
import ToolList from "@/data/toolList";
import { getMdContent } from "@/lib/api.js";
import Head from "@/components/Head";

export default function Tool({ meta, content }) {
  return (
    <>
      <Head
        title={meta.title}
        description={meta.description}
        pageUrl={`/tools/image/${meta.slug}`}
        imageName={meta.imageName}
        featureList={meta.featureList}
      ></Head>

      <ToolContainer
        title={meta.title}
        description={meta.description}
        similarTools={<SimilarTools tags={meta.tags} toolType={"image"} />}
        tool={
          <ImageTool
            config={{
              width: meta.config.width,
              height: meta.config.height,
              percentage: meta.config.percentage,
              targetSize: meta.config.targetSize,
              quality: meta.config.quality,
              format: meta.config.format,
              maintainAspectRatio: meta.config.maintainAspectRatio,
              unit: meta.config.unit,
              dpi: meta.config.dpi,
              rotate: meta.config.rotate
            }}
          />
        }
        content={<ToolContent content={content} />}
      />
    </>
  );
}

export async function getStaticPaths() {
  try {
    const paths = ToolList.image.map((item) => {
      return {
        params: {
          slug: item.slug,
        },
      };
    });

    return {
      paths,
      fallback: false,
    };
  } catch (err) {
    console.error("Error in getStaticPaths:", err);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const data = ToolList.image.find((item) => params.slug == item.slug);

    const { content } = await getMdContent(data.contentPath);

    if ((data && data.length == 0) || !content) {
      return { notFound: true };
    }

    return {
      props: {
        meta: data,
        content,
      },
    };
  } catch (err) {
    console.error("Error in getStaticProps", err);
    return { notFound: true };
  }
}
