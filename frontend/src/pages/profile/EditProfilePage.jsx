import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';
import SkillTag from '../../components/SkillTag';

const EditProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user?.skillsWanted || []);

  const getAvatar = (u) => {
    return u?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u?.name || 'User'}`;
  };

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
    const success = await updateProfile({
      ...formData,
      skillsOffered,
      skillsWanted,
    });
    
    if (success) {
      toast.success('Profile updated successfully!');
      navigate('/profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 font-medium">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card p-8 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <img src={getAvatar(user)} alt={user?.name} className="h-24 w-24 rounded-2xl object-cover bg-gray-100" />
              <button type="button" className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ImageIcon className="h-8 w-8 text-white" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Profile Photo</h3>
              <p className="text-gray-500 text-sm">JPG, PNG or SVG. Max 2MB.</p>
              <button type="button" className="text-primary-600 font-bold text-sm hover:text-primary-700 mt-1">Upload new photo</button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
              <textarea
                className="input-field min-h-[120px]"
                placeholder="Tell others about yourself and what you're looking to learn..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Skills I Offer</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                className="input-field"
                placeholder="Add a skill..."
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOffered(e)}
              />
              <button type="button" onClick={handleAddOffered} className="p-2 bg-primary-100 rounded-lg text-primary-600 hover:bg-primary-200">
                <Plus className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsOffered.map(skill => (
                <SkillTag key={skill} skill={skill} onRemove={removeOffered} />
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Skills I Want</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                className="input-field"
                placeholder="Add a skill..."
                value={wantedSkill}
                onChange={(e) => setWantedSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddWanted(e)}
              />
              <button type="button" onClick={handleAddWanted} className="p-2 bg-secondary-100 rounded-lg text-secondary-600 hover:bg-secondary-200">
                <Plus className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsWanted.map(skill => (
                <SkillTag key={skill} skill={skill} color="secondary" onRemove={removeWanted} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-gray-600 font-bold hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary px-8 flex items-center">
            <Save className="h-5 w-5 mr-2" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
