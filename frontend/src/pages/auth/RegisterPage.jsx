import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Plus, X } from 'lucide-react';
import SkillTag from '../../components/SkillTag';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleAddOffered = (e) => {
    e.preventDefault();
    if (offeredSkill && !skillsOffered.includes(offeredSkill)) {
      setSkillsOffered([...skillsOffered, offeredSkill]);
      setOfferedSkill('');
    }
  };

  const handleAddWanted = (e) => {
    e.preventDefault();
    if (wantedSkill && !skillsWanted.includes(wantedSkill)) {
      setSkillsWanted([...skillsWanted, wantedSkill]);
      setWantedSkill('');
    }
  };

  const removeOffered = (skill) => setSkillsOffered(skillsOffered.filter(s => s !== skill));
  const removeWanted = (skill) => setSkillsWanted(skillsWanted.filter(s => s !== skill));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password && skillsOffered.length > 0) {
      const result = await register({
        ...formData,
        skillsOffered,
        skillsWanted,
      });
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } else {
      toast.error('Please fill in all fields and add at least one skill offered');
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full glass p-8 rounded-2xl shadow-2xl my-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Join SkillSwap</h2>
          <p className="mt-2 text-indigo-100">Start your skill exchange journey today</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="input-field pl-10 bg-white/90 border-transparent"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="input-field pl-10 bg-white/90 border-transparent"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="input-field pl-10 bg-white/90 border-transparent"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Skills You Offer</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="input-field bg-white/90 border-transparent"
                    placeholder="e.g. React"
                    value={offeredSkill}
                    onChange={(e) => setOfferedSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOffered(e)}
                  />
                  <button type="button" onClick={handleAddOffered} className="p-2 bg-white rounded-lg text-primary-600 hover:bg-primary-50">
                    <Plus className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillsOffered.map(skill => (
                    <SkillTag key={skill} skill={skill} onRemove={removeOffered} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Skills You Want</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="input-field bg-white/90 border-transparent"
                    placeholder="e.g. Python"
                    value={wantedSkill}
                    onChange={(e) => setWantedSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddWanted(e)}
                  />
                  <button type="button" onClick={handleAddWanted} className="p-2 bg-white rounded-lg text-secondary-600 hover:bg-secondary-50">
                    <Plus className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillsWanted.map(skill => (
                    <SkillTag key={skill} skill={skill} onRemove={removeWanted} color="secondary" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-primary-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:-translate-y-0.5 mt-8">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-indigo-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
