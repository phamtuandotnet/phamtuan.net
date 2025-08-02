import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/layout/header';
import Footer from '@/layout/footer';
import { getData, postData } from '@/service/api';
import { ResponseCategoryDTO } from '@/dto/CategoryDTO';
import { ResponsePostDTO } from '@/dto/PostDTO';
import { headers } from 'next/headers';
import process from 'process';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'PT Entertainment',
  description: 'Created by PT Entertainment',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get('locale') || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;

  const responseCategories = await getData(`api/categories/count?locale=${locale}`);
  const categories: ResponseCategoryDTO[] = responseCategories;

  const responsePost = await postData(
    `api/posts/search?pagination[page]=${1}&&pagination[pageSize]=${4}&&populate=thumbnail&&populate=categories&&locale=${locale}`,
    {},
  );
  const posts: ResponsePostDTO[] = responsePost.data;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header/>
        <div className="2xl:px-[250px] px-[20px]">
          <div className="grid gap-12 md:grid-cols-3  mt-20">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
