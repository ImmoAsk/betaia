import signin from './signin';

export default function signup() {
	return signin({signup: true});
}