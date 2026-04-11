"use client"

import React from 'react';
import Link from 'next/link';
import { StorySection } from '@/components/StorySection';
import { Cinzel } from "next/font/google";
import { siteConfig } from '@/content/site';

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

export function LoveStory() {
  return (
    <div className="min-h-screen bg-motif-cream overflow-x-hidden">


      <div className="text-center text-motif-medium z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <h1
           className="lighten-regular text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight"
           style={{ color: 'var(--color-motif-deep)' }}
          >
          Our Love Story
          </h1>

        {/* <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-[0.14em] sm:tracking-[0.18em] font-normal leading-tight text-motif-medium mb-1`}>
          Every photograph tells a story of {siteConfig.couple.brideNickname} & {siteConfig.couple.groomNickname}'s journey to forever
        </p> */}
      </div>

      {/* SECTION 1: Top - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        title="A Love Meant to Last"
        imageSrc="/couple/c (2).png"
        text={
          <>
            <p className="mb-4">
            We first met as high school classmates. By our third
year, Ken already knew what his heart wanted.
Unfortunately, Ivy’s heart was busy admiring
<br />
someone else at the time. So instead of confessing,
<br />
Ken chose the brave and noble path of… staying quiet.
            </p>
           
          </>
        }
      />

      {/* SECTION 2: Middle - Light */}
      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/couple/c (3).png"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            He chose friendship. And honestly, that might have
<br />
been the best decision he ever made. We graduated
<br />
in 2012 as close friends, not realizing that time
<br />
was slowly doing its thing and quietly weaving

our hearts together behind the scenes.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/couple/c (4).png"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            Fast forward to 2014, during our second year
<br />
of college, when Ken finally gathered the courage
<br />
to say what he had been holding in for years.
<br />
The feelings were real, but life had other plans.
<br />
Ivy was focused on studies and responsibilities
<br />
and sometimes love needs people to grow on their
<br />
own first. So we went our separate ways…
<br />
pretending we were totally fine with it.
<br />  
<br />
Ken tried to move on, but his heart clearly
<br />
didn’t get the memo.
            </p>
           
          </>
        }
      />
            {/* SECTION 2: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/couple/c (6).png"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            Two years later, in 2016, he reached out again.
<br />
Distance still stood between us, but this time
<br />
something had changed. Ivy’s heart had slowly
<br />
started to open, and Ken’s steady presence,
<br />
patience, and genuine care started turning our
friendship into something deeper. Somewhere
<br />
along the way, feelings became mutual.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/couple/c (7).png"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            Love had officially entered the chat. But once
<br />
again, timing had other plans. With school to
<br />
finish and family guidance to respect, we had
<br />
to part ways again.
            </p>
           
          </>
        }
      />
            {/* SECTION 2: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/couple/c (9).png"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            Life took us down different paths. We each faced
personal journeys that required growth, healing,
<br />
and learning more about ourselves. We even tried
opening our hearts to other possibilities, thinking
<br />
that maybe moving forward meant letting go.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/couple/c (11).png"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            But somehow, no matter where life took us,
<br />
nothing ever quite felt the same. It turns out
<br />
our hearts were a little stubborn. They always
<br />
seemed to find their way back to each other.
<br />
Because true love, as we eventually learned,
<br />    
is never really in a hurry. It waits.
<br /> <br /> 
Three years passed.
<br />
No communication.
<br />
No promises.
<br />
Just life doing its thing.
            </p>
           
          </>
        }
      />
            {/* SECTION 2: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/couple/c (13).png"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            Then in October 2019, just as Ivy was about
<br />
to graduate, something unexpected happened.
<br />
Through a simple gathering with friends in
<br />
San Juan, La Union, life decided to bring us back
<br />
into the same place at the same time.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/couple/c (17).png"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            One meeting. That’s all it took.
            <br />
            <br />
            The connection was still there, if anything,
<br />
stronger than before. What once felt
<br />
unfinished suddenly felt right.
<br />
<br />
So this time, we stopped overthinking and
<br />
simply chose each other.
            </p>
           
          </>
        }
      />
            {/* SECTION 2: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/couple/c (20).png"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            Six and a half years later, we’ve grown together
<br />
through dreams and doubts, triumphs and trials.
Somewhere along the way, we became each other’s
<br />
safe place, biggest supporter, and constant prayer.
<br />
<br />
Love taught us patience.
<br />
Faith taught us trust.
<br />
And life showed us that what is meant for you
<br />
will always find its way back, sometimes just
<br />
a little later than expected.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/couple/c (21).png"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            Today, we stand hand in hand,
<br />
no longer waiting, just grateful.
<br />
Grateful for every twist, every pause,
<br />
and every moment that led us back to
<br />
each other.Now we’re ready to build a
<br />
home filled with love, laughter, and faith.
<br />
Ready to start a family.
<br />

And ready to spend the rest of our lives
<br />
choosing each other, every single day.
<br />
<br />
Because in the end, that’s what love is all about.
<br />
Choosing each other, every single day.
            </p>
           
          </>
        }
      />

      
      {/* Footer Decoration */}
      <div className="bg-motif-cream pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 text-center text-motif-deep z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>

        {/* Bible Verse */}
        <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-10 sm:mb-12 px-4">
          <p className={`${cinzel.className} text-sm sm:text-[0.95rem] md:text-base italic leading-relaxed tracking-wide text-motif-deep/75`}>
            &ldquo;Love is patient, love is kind.
            <br />
            It does not envy, it does not boast,
            <br />
            it is not proud.&rdquo;
          </p>
          <div className="w-6 h-px bg-motif-deep/30 mx-auto my-3" />
          <p className={`${cinzel.className} text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] uppercase text-motif-deep/45`}>
            1 Corinthians 13:4
          </p>
        </div>

        <Link 
          href="#guest-list"
          className={`${cinzel.className} group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-[0.7rem] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-normal text-motif-cream bg-motif-deep rounded-sm border border-motif-deep transition-all duration-300 hover:bg-motif-accent hover:border-motif-accent hover:text-motif-cream hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-soft/50 focus-visible:ring-offset-2 focus-visible:ring-offset-motif-cream`}
        >
          <span className="relative z-10">Join us</span>
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-sm bg-motif-soft opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300 -z-0"></div>
        </Link>
      </div>

    </div>
  );
}

