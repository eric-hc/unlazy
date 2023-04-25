import { createEffect, onCleanup, onMount, splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

interface Props
  extends JSX.ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /** Image source URL to be lazy-loaded. */
  src?: JSX.ImgHTMLAttributes<HTMLImageElement>['src']
  /** Image source set to be lazy-loaded. */
  srcSet?: JSX.ImgHTMLAttributes<HTMLImageElement>['srcSet']
  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  autoSizes?: boolean
  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string
  /** A ThumbHash string representing the blurry placeholder image. */
  thumbhash?: string
  /** Optional image source URL for a custom placeholder image. Will be ignored if a BlurHash or ThumbHash is provided. */
  placeholderSrc?: string
}

export function UnLazyImage(props: Props) {
  const [local, rest] = splitProps(
    props,
    ['src', 'srcSet', 'autoSizes', 'blurhash', 'thumbhash', 'placeholderSrc', 'placeholderSize'],
  )
  let target: HTMLImageElement

  onMount(() => {
    if (!target)
      return

    createEffect(() => {
      const cleanup = lazyLoad(target, {
        hash: local.thumbhash || local.blurhash,
        hashType: local.thumbhash ? 'thumbhash' : 'blurhash',
        placeholderSize: local.placeholderSize,
      })

      onCleanup(() => {
        cleanup()
      })
    })
  })

  return (
    <img
      ref={el => (target = el)}
      src={local.placeholderSrc}
      data-src={local.src}
      data-srcset={local.srcSet}
      data-sizes={local.autoSizes ? 'auto' : undefined}
      loading="lazy"
      {...rest}
    />
  )
}
