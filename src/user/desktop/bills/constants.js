import { Tv, Zap, Wifi } from 'lucide-react'
import dstvLogo from '../../../assets/dstv.jpg'
import gotvLogo from '../../../assets/gotv.jpg'
import startimesLogo from '../../../assets/startime.jpg'
import showmaxLogo from '../../../assets/showmax.png'
import ikedcLogo from '../../../assets/ikedc.png'
import ekedcLogo from '../../../assets/ekedc.jpg'
import kedcoLogo from '../../../assets/kedco.jpg'
import phedcLogo from '../../../assets/phedc.png'
import jedLogo from '../../../assets/jed.jpg'
import ibedcLogo from '../../../assets/ibedc.jpg'
import kaedcoLogo from '../../../assets/kaedco.jpg'
import aedcLogo from '../../../assets/aedc.png'
import eedcLogo from '../../../assets/eedc.png'
import bedcLogo from '../../../assets/bedc.jpg'
import abaLogo from '../../../assets/aba.jpg'
import yedcLogo from '../../../assets/yedc.jpg'
import spectranetLogo from '../../../assets/spectranet.webp'
import smileLogo from '../../../assets/smile.jpg'

export const CATEGORIES = [
  {
    id: 'cable',
    label: 'Cable TV',
    icon: Tv,
    desc: 'Pay for your TV subscription instantly.',
    providers: ['DSTV', 'GoTV', 'StarTimes', 'ShowMax'],
    count: 4,
    accountLabel: 'Smartcard number',
    accountPlaceholder: '1234567890',
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: Zap,
    desc: 'Buy prepaid or postpaid electricity tokens.',
    providers: ['Ikeja', 'Eko', 'Abuja', 'Port Harcourt', '+8 more'],
    count: 12,
    accountLabel: 'Meter number',
    accountPlaceholder: '1234567890123',
  },
  {
    id: 'internet',
    label: 'Internet',
    icon: Wifi,
    desc: 'Renew your broadband subscription.',
    providers: ['Spectranet', 'Smile'],
    count: 2,
    accountLabel: 'Account number',
    accountPlaceholder: 'Account / username',
  },
]

export const PROVIDERS = {
  cable: [
    { id: 'dstv',      label: 'DSTV',      logo: dstvLogo,      serviceId: 'dstv' },
    { id: 'gotv',      label: 'GoTV',      logo: gotvLogo,      serviceId: 'gotv' },
    { id: 'startimes', label: 'StarTimes', logo: startimesLogo, serviceId: 'startimes' },
    { id: 'showmax',   label: 'ShowMax',   logo: showmaxLogo,   serviceId: 'showmax' },
  ],
  electricity: [
    { id: 'ikedc',  label: 'Ikeja',         logo: ikedcLogo,  serviceId: 'ikeja-electric' },
    { id: 'ekedc',  label: 'Eko',           logo: ekedcLogo,  serviceId: 'eko-electric' },
    { id: 'aedc',   label: 'Abuja',         logo: aedcLogo,   serviceId: 'abuja-electric' },
    { id: 'phedc',  label: 'Port Harcourt', logo: phedcLogo,  serviceId: 'portharcourt-electric' },
    { id: 'ibedc',  label: 'Ibadan',        logo: ibedcLogo,  serviceId: 'ibadan-electric' },
    { id: 'eedc',   label: 'Enugu',         logo: eedcLogo,   serviceId: 'enugu-electric' },
    { id: 'kedco',  label: 'Kano',          logo: kedcoLogo,  serviceId: 'kano-electric' },
    { id: 'kaedco', label: 'Kaduna',        logo: kaedcoLogo, serviceId: 'kaduna-electric' },
    { id: 'jed',    label: 'Jos',           logo: jedLogo,    serviceId: 'jos-electric' },
    { id: 'bedc',   label: 'Benin',         logo: bedcLogo,   serviceId: 'benin-electric' },
    { id: 'aba',    label: 'Aba',           logo: abaLogo,    serviceId: 'aba-electric' },
    { id: 'yedc',   label: 'Yola',          logo: yedcLogo,   serviceId: 'yola-electric' },
  ],
  internet: [
    { id: 'spectranet', label: 'Spectranet', logo: spectranetLogo, serviceId: 'spectranet' },
    { id: 'smile',      label: 'Smile',      logo: smileLogo,      serviceId: 'smile' },
  ],
}

export const PRESETS = [1000, 2000, 5000, 10000, 15000, 20000]

export const METER_TYPES = [
  { id: 'prepaid',  label: 'Prepaid' },
  { id: 'postpaid', label: 'Postpaid' },
]

export const CASHBACK_RATE = 0.01

export function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

export function mockName(account) {
  const names = ['John Doe', 'Sarah Okafor', 'Tunde Adebayo', 'Aisha Bello', 'Chinedu Eze']
  const idx = account.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % names.length
  return names[idx]
}
