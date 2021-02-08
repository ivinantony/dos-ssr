import { AnimationController, Animation } from '@ionic/angular';
const animationCtrl = new AnimationController();

export const modalEnterAnimation = (baseEl: any) => {
  const header = baseEl.querySelector('ion-header')
  if (header) {
    header.style.opacity = 0
  }
  const backdropAnimation = animationCtrl.create()
    .addElement(baseEl.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  const wrapperAnimation = animationCtrl.create()
    .addElement(baseEl.querySelector('.modal-wrapper'))
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0)' },
      { offset: 1, opacity: '0.99', transform: 'scale(1)' }
    ]);

  wrapperAnimation.onFinish(() => {

    const headerVisible = animationCtrl.create()
      .addElement(baseEl.querySelector('ion-header'))
      .duration(200)
      .easing('ease-in')
      .fromTo('opacity', 0, 1)

    headerVisible.play()
  })


  return animationCtrl.create()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
}

export const modalLeaveAnimation = (baseEl: any) => {

  const backdropAnimation = animationCtrl.create()
    .addElement(baseEl.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  const wrapperAnimation = animationCtrl.create()
    .addElement(baseEl.querySelector('.modal-wrapper'))
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0)' },
      { offset: 1, opacity: '0.99', transform: 'scale(1)' }
    ]);

  return animationCtrl.create()
    .addElement(baseEl)
    .direction('reverse')
    .easing('ease-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);

}